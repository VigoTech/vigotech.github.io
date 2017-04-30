package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/tidwall/gjson"
)

// TODO: Update Travis file

var videosMD = "content/page/videos.md"
var videosNoYoutube = "scripts/videosNoYoutube.txt"
var videosLanding = "content/post/vigotech-charlas.md"
var projectsMD = "content/page/proxectos.md"
var projectsLanding = "content/post/vigotech-proxectos.md"
var channelJSON = "scripts/channels.json"
var projectsJSON = "scripts/projects.json"

type channelType []struct {
	ChannelName string `json:"channelName"`
	ChannelID   string `json:"channelID"`
}

var channels = channelType{}

type video struct {
	title, videoID, channel, publishedAt string
}

type videosType []video

func (slice videosType) Len() int {
	return len(slice)
}

func (slice videosType) Less(i, j int) bool {
	return slice[i].publishedAt < slice[j].publishedAt
}

func (slice videosType) Swap(i, j int) {
	slice[i], slice[j] = slice[j], slice[i]
}

var videos = videosType{}

type projectsType []struct {
	User string `json:"user"`
	Repo string `json:"repo"`
}

var projects = projectsType{}

func main() {

	token := os.Getenv("YOUTUBE_TOKEN")
	now := time.Now().Format(time.RFC3339)

	// Read JSON channels
	c, err6 := os.Open(channelJSON)
	if err6 != nil {
		log.Fatal("Not able to open ", channelJSON)
	}

	jsonParser := json.NewDecoder(c)
	if err6 = jsonParser.Decode(&channels); err6 != nil {
		log.Fatal("Parsing channels JSONfile", err6.Error())
	}

	// Read JSON channels
	c1, err7 := os.Open(projectsJSON)
	if err7 != nil {
		log.Fatal("Not able to open ", projectsJSON)
	}

	jsonParser = json.NewDecoder(c1)
	if err7 = jsonParser.Decode(&projects); err7 != nil {
		log.Fatal("Parsing projects JSON file", err7.Error())
	}

	// Prepare Videos Markdown page
	_ = os.Truncate(videosMD, 0)
	var file, err = os.OpenFile(videosMD, os.O_RDWR, 0644)
	if err != nil {
		log.Fatal("Not able to open ", videosMD)
	}
	defer file.Close()

	s := `+++
date = "$now"
draft = false
title = "Charlas"
type = "page"
weight = 1
+++

----
Charlas gravadas polos distintos grupos:

`

	file.WriteString(strings.Replace(s, "$now", now, 1))

	for _, c := range channels {
		// Processing YouTube Requests
		url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?"+
			"key=%s&channelId=%s&part=snippet,id&order=date&maxResults=50",
			token, c.ChannelID)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			log.Fatal("NewRequest: ", err)
			return
		}

		client := &http.Client{}

		resp, err := client.Do(req)
		if err != nil {
			log.Fatal("Do: ", err)
			return
		}

		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Fatal("YouTube response is: ", resp.StatusCode)
		}

		bodyBytes, _ := ioutil.ReadAll(resp.Body)
		record := string(bodyBytes)

		totalResults := gjson.Get(record, "pageInfo.totalResults")

		if totalResults.Int() > 49 {
			log.Fatal("Returned 50 videos, we could loose records")
		}
		s1 := fmt.Sprintf(
			"\n\n### [%s](https://www.youtube.com/channel/%s)\n\n",
			c.ChannelName,
			c.ChannelID)
		file.WriteString(s1)

		r := gjson.Get(record, "items")
		for _, item := range r.Array() {

			kind := gjson.Get(item.String(), "id.kind")

			if kind.String() != "youtube#video" {
				continue
			}

			title := gjson.Get(item.String(), "snippet.title").String()
			videoID := gjson.Get(item.String(), "id.videoId").String()
			publishedAt := gjson.Get(
				item.String(),
				"snippet.publishedAt").String()

			s2 := fmt.Sprintf("- [%s](https://www.youtube.com/watch?v=%s)\n",
				title, videoID)
			file.WriteString(s2)

			videos = append(videos, video{
				title:       title,
				videoID:     videoID,
				channel:     c.ChannelName,
				publishedAt: publishedAt,
			})
		}
	}

	// Add videos which aren't hosted in YouTube
	dat, err := ioutil.ReadFile(videosNoYoutube)
	if err != nil {
		log.Fatal("Not able to open ", videosNoYoutube)
	}
	file.WriteString(string(dat))

	// Update the videos landing page
	_ = os.Truncate(videosLanding, 0)
	var fileLanding, err3 = os.OpenFile(videosLanding, os.O_RDWR, 0644)
	if err3 != nil {
		log.Fatal("Not able to open ", videosLanding)
	}
	defer fileLanding.Close()

	s = `+++
date = "$now"
draft = false
title = "Charlas"
weight = 102
type = "post"
class="post last"

+++

A maioría de charlas está gravadas e dispoñibles para o seu visionado.
Están son as tres últimas:

`
	fileLanding.WriteString(strings.Replace(s, "$now", now, 1))

	sort.Sort(sort.Reverse(videos))

	for i, v := range videos {

		s = fmt.Sprintf("* [%s](https://www.youtube.com/watch?v=%s) (%s)\n",
			v.title,
			v.videoID,
			v.channel)

		fileLanding.WriteString(s)

		s = fmt.Sprintf("<iframe width=\"560\" height=\"315\" "+
			" src=\"https://www.youtube.com/embed/%s\" "+
			"frameborder=\"0\" allowfullscreen></iframe>\n",
			v.videoID)

		fileLanding.WriteString(s)

		if i == 2 {
			break
		}
	}

	s = "\n\n* [Preme aquí para ver tódalas charlas](./page/videos/)"
	fileLanding.WriteString(s)

	// Prepare Proxectos file output
	_ = os.Truncate(projectsMD, 0)
	var fileProjects, err4 = os.OpenFile(projectsMD, os.O_RDWR, 0644)
	if err4 != nil {
		log.Fatal("Not able to open ", projectsMD)
	}
	defer fileProjects.Close()

	s = `+++
date = "$now"
draft = false
title = "Proxectos"
type = "page"
weight = 1
+++

----
Proxectos de código aberto creados por xente da comunidade:

`

	fileProjects.WriteString(strings.Replace(s, "$now", now, 1))

	fileProjects.WriteString("<div class=\"container\">\n\n")

	for i, v := range projects {

		if i%2 == 0 {
			fileProjects.WriteString("<div class=\"row\">\n")
		}

		s = fmt.Sprintf("\n<div class=\"cell-card\">"+
			"<div class=\"github-card\" data-user=\"%s\" "+
			"data-repo=\"%s\"></div></div>\n",
			v.User,
			v.Repo)

		fileProjects.WriteString(s)

		if i%2 == 1 || len(projects)-1 == i {
			fileProjects.WriteString("</div>\n")
		}
	}
	fileProjects.WriteString("</div>\n\n")

	fileProjects.WriteString("<script src=\"" +
		"//cdn.jsdelivr.net/github-cards/latest/widget.js\"></script>\"")

	// Update the projects landing page
	_ = os.Truncate(projectsLanding, 0)
	var fileProjectsLanding, err5 = os.OpenFile(
		projectsLanding, os.O_RDWR, 0644)
	if err5 != nil {
		log.Fatal("Not able to open ", projectsLanding)
	}
	defer fileProjectsLanding.Close()

	s = `+++
date = "$now"
draft = false
title = "Proxectos"
weight = 103
type = "post"
class="post last"

+++

Proxectos de código aberto creados por xente da comunidade:
`
	fileProjectsLanding.WriteString(strings.Replace(s, "$now", now, 1))

	rand.Seed(time.Now().Unix())
	random := rand.Int()

	fileProjectsLanding.WriteString("<div class=\"container\">\n\n")

	for i := 0; i < 6; i++ {

		if i%2 == 0 {
			fileProjectsLanding.WriteString("<div class=\"row\">\n")
		}

		n := (random + i) % len(projects)
		s = fmt.Sprintf("\n<div class=\"cell-card\">"+
			"<div class=\"github-card\" data-user=\"%s\" "+
			"data-repo=\"%s\"></div></div>\n",
			projects[n].User,
			projects[n].Repo)

		fileProjectsLanding.WriteString(s)

		if i%2 == 1 {
			fileProjectsLanding.WriteString("</div>\n")
		}
	}

	fileProjectsLanding.WriteString("</div>\n\n")

	s = `

* [Preme aquí para ver tódolos proxectos](./page/proxectos/)

<script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
`
	fileProjectsLanding.WriteString(s)

}
