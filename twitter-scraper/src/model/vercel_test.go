package model

import (
	"testing"
	"time"
	"twitter-scraper/src/utils"
)

func TestVercelPost(t *testing.T) {
	updateUsers := []string{}
	updateUsers = append(updateUsers, "测试")
	updateUsers = append(updateUsers, "test")
	updateInfo := utils.UpdateInfo{UpdateTime: time.Now().Unix(), IsUpdate: true, Users: updateUsers}
	postInfo := utils.PostUpdateInfo{Info: updateInfo, Type: "changeusers"}
	t.Log(postInfo)
	PostUpdateInfo(postInfo)
}
