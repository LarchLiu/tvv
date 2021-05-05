package model

import (
	"os"

	"github.com/pusher/pusher-http-go"
)

var appId string = os.Getenv("PUSHER_APP_ID")
var key string = os.Getenv("PUSHER_KEY")
var secret string = os.Getenv("PUSHER_SECRET")
var cluster string = os.Getenv("PUSHER_CLUSTER")

func PusherUpdateInfo(data interface{}) error {
	pusherClient := pusher.Client{
		AppID:   appId,
		Key:     key,
		Secret:  secret,
		Cluster: cluster,
	}
	return pusherClient.Trigger("update-info", "scraper-post", data)
}
