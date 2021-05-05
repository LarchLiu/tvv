package model

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
)

var vercel_url string = os.Getenv("VERCEL_APP_URL")

func PostUpdateInfo(data interface{}) string {
	jsonStr, _ := json.Marshal(data)
	req, _ := http.NewRequest("POST", vercel_url+"/api/updateInfo", bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	result, _ := ioutil.ReadAll(resp.Body)
	return string(result)
}
