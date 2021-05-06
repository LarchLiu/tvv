package utils

import twitterscraper "github.com/n0madic/twitter-scraper"

type (
	// UserInfo user info type.
	UserInfo struct {
		Avatar         string
		Username       string
		Name           string
		LastTweetTime  int64
		LastUpdateTime int64
		TweetsCount    int64
	}
	// DbProfile type.
	DbProfile struct {
		UserInfo
		Profile twitterscraper.Profile
	}
	// Twitter type.
	Twitter struct {
		DbProfile
		Tweets []twitterscraper.Tweet
	}
	// DbImage image info in db
	DbImage struct {
		PicBed   string
		FileName string
		Key      string
		User     string
		URL      string
		Type     string // photo video or profile
		Idx      int    // photo/video: index of photos/videos  profile: 0 -> avatar 1 ->banner
		Status   string // upload status: success or fail
		TweetID  string // if Type is tweet use tweetid for upload fail
	}
	// UpdateInfo update info
	UpdateInfo struct {
		UpdateTime int64
		IsUpdate   bool
		Users      []string
		Type       string
	}
	// EventInfo users change info
	EventInfo struct {
		Event string `env:"EVENT_NAME" envDefault:""`
		Type  string `env:"ACTION_TYPE" envDefault:""`
		Users string `env:"USERS_DATA" envDefault:""`
	}
)
