package main

import (
	"context"
	"fmt"
	"os"
	"path"
	"regexp"
	"strings"
	"time"
	"twitter-scraper/src/model"
	"twitter-scraper/src/utils"

	"github.com/caarlos0/env/v6"
	twitterscraper "github.com/n0madic/twitter-scraper"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	info := utils.EventInfo{}
	if err := env.Parse(&info); err != nil {
		fmt.Printf("%+v\n", err)
	}
	triggerType := info.Event

	if info.Event == "repository_dispatch" {
		triggerType = info.Type
	} else if info.Event == "workflow_dispatch" {
		triggerType = "manual"
	}

	ctx := context.Background()
	cli, e := model.DbInit()
	if e != nil {
		fmt.Println(e)
		return
	}
	collProfile := model.DbColl(cli, "tweeps")
	collTweet := model.DbColl(cli, "tweets")
	collUpdate := model.DbColl(cli, "updates")
	defer func() {
		model.DbClose(cli)
	}()

	var users []string
	dir, _ := os.Getwd()
	twitterDir := path.Join(dir, "./raw/twitter") + "/"
	imgReg := regexp.MustCompile(`(?s)(\<br\>\<a href=(.*)\>\<img(.*)\<\/a\>)(?s)`)

	if info.Type == "addusers" {
		addUsers := strings.Split(info.Users, ",")
		for _, user := range addUsers {
			one := utils.DbProfile{}
			one.Username = user
			collProfile.InsertOne(ctx, utils.DbProfile{UserInfo: one.UserInfo})
			users = append(users, user)
		}
	} else {
		all := []utils.DbProfile{}
		err := collProfile.Find(ctx, bson.D{{}}).Sort("_id").All(&all)
		if err != nil {
			fmt.Println(err)
		} else {
			for _, user := range all {
				users = append(users, user.Username)
			}
			if len(users) == 0 {
				f, err := utils.GetFileContent(twitterDir + "userList.txt")
				if err != nil {
					fmt.Println(err)
				} else {
					f = strings.Replace(f, " ", "", -1) // 删除空格
					users = strings.Split(f, ",")
					for _, user := range users {
						one := utils.DbProfile{}
						one.Username = user
						one.LastTweetTime = 0
						one.LastUpdateTime = time.Now().Unix()
						one.TweetsCount = 0
						collProfile.InsertOne(ctx, utils.DbProfile{UserInfo: one.UserInfo})
					}
				}
			}
		}
	}

	scraper := twitterscraper.New()
	isUpdate := false
	updateUsers := []string{}
	for _, user := range users {
		var tweets []twitterscraper.Tweet
		maxTweetsNbr := 200
		count := 0
		one := utils.DbProfile{}
		err := collProfile.Find(ctx, bson.M{"userinfo.username": user}).One(&one)
		if err != nil {
			fmt.Println(err)
		}
		if err == nil {
			lastTweetTime := one.LastTweetTime
			curLastTweetTime := lastTweetTime
			for tweet := range scraper.GetTweets(context.Background(), user, maxTweetsNbr) {
				if tweet.Error != nil {
					fmt.Println(tweet.Error)
				} else {
					if lastTweetTime >= tweet.Tweet.Timestamp {
						break
					}
					if count == 0 {
						curLastTweetTime = tweet.Tweet.Timestamp
					}
					if tweet.Tweet.Photos != nil && len(tweet.Tweet.Photos) > 0 {
						var photos []string
						for _, src := range tweet.Tweet.Photos {
							htmlSrc := utils.ReplaceDomain(src, "")
							photos = append(photos, htmlSrc)
						}
						tweet.Tweet.Photos = photos
					}
					if tweet.Tweet.Videos != nil && len(tweet.Tweet.Videos) > 0 {
						var videos []twitterscraper.Video
						for _, video := range tweet.Tweet.Videos {
							htmlSrc := utils.ReplaceDomain(video.Preview, "")
							video.Preview = htmlSrc
							video.URL = utils.ReplaceDomain(video.URL, "")
							videos = append(videos, video)
						}
						tweet.Tweet.Videos = videos
					}
					if tweet.Tweet.HTML != "" {
						tweet.Tweet.HTML = imgReg.ReplaceAllString(tweet.Tweet.HTML, "")
					}
					tweets = append(tweets, tweet.Tweet)
					count++
				}
			}

			if count > 0 {
				isUpdate = true
				updateUsers = append(updateUsers, user)

				collTweet.InsertMany(ctx, tweets)
			}

			tweetsCnt, _ := collTweet.Find(ctx, bson.M{"username": user}).Count()

			profile, err := scraper.GetProfile(user)
			if err != nil {
				fmt.Println(err)
			} else {
				if profile.Avatar != "" {
					profile.Avatar = utils.ReplaceDomain(profile.Avatar, "")
				}
				if profile.Banner != "" {
					profile.Banner = utils.ReplaceDomain(profile.Banner, "")
				}
				userInfo := utils.UserInfo{Avatar: profile.Avatar, Username: user, Name: profile.Name,
					LastTweetTime: curLastTweetTime, LastUpdateTime: time.Now().Unix(), TweetsCount: tweetsCnt}
				dbProfile := utils.DbProfile{UserInfo: userInfo, Profile: profile}

				update := bson.D{
					{Key: "$set", Value: bson.D{
						{Key: "profile", Value: dbProfile.Profile},
						{Key: "userinfo", Value: dbProfile.UserInfo},
					}},
				}
				e := collProfile.UpdateOne(ctx, bson.M{"userinfo.username": profile.Username}, update)
				if e != nil {
					fmt.Println(e)
				}
			}
		}
	}

	updateInfo := utils.UpdateInfo{UpdateTime: time.Now().Unix(), IsUpdate: isUpdate, Users: updateUsers, Type: triggerType}
	collUpdate.InsertOne(ctx, updateInfo)
	var i int = 1
	for {
		err := model.PusherUpdateInfo(updateInfo)
		if err == nil || i == 5 {
			break
		}
		i++
	}
}
