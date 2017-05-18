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
	"errors"
	"text/template"
)

// TODO:
// Separate in functions
// Add templates
// Add comments
// Check govet and others
// Update README
// Add test

// Configuration files
var channelJSON = "scripts/channels.json"
var projectsJSON = "scripts/projects.json"

// Output files
var videosPage = "content/page/videos.md"
var videosLandingPage = "content/post/vigotech-charlas.md"
var projectsPage = "content/page/proxectos.md"
var projectsLandingPage = "content/post/vigotech-proxectos.md"

// Template files
var videosTemplate = "scripts/templates/videos.tmpl"
var projectsTemplate = "scripts/templates/proxectos.tmpl"
var videosLandingTemplate = "scripts/templates/vigotech-charlas.tmpl"
var projectsLandingTemplate = "scripts/templates/vigotech-proxectos.tmpl"

// Youtube video types
type channelType []struct {
	ChannelName string `json:"channelName"`
	ChannelID   string `json:"channelID"`
}

type video struct {
	title, videoID, channelID, channelName, publishedAt string
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

type videoList struct {
	Date   string
	Videos videosType
}

// Github projects types
type projectsType []struct {
	User string `json:"user"`
	Repo string `json:"repo"`
}

//TODO
func generateVideosPage(videos videosType) (err error) {

	config := videoList{
		Date:   time.Now().Format(time.RFC3339),
		Videos: videos,
	}

	t, err := template.ParseFiles(videosTemplate)
	if err != nil {
		return err
	}

	f, err := os.Create(videosPage)
	if err != nil {
		return err
	}
	defer f.Close()

	err = t.Execute(f, config)
	if err != nil {
		return err
	}

	return nil
}

//TODO
func generateLandingVideosPage() {
}

// TODO
func generateProjectsPage() {
}

// TODO
func generateProjectsLandingPage() {
}

func loadVideosConfig() (channels channelType, err error) {

	c, err := os.Open(channelJSON)
	if err != nil {
		return nil, err
	}

	jsonParser := json.NewDecoder(c)
	if err = jsonParser.Decode(&channels); err != nil {
		return nil, err
	}

	return channels, nil
}

func loadProjectsConfig() (projects projectsType, err error) {

	c, err := os.Open(projectsJSON)
	if err != nil {
		return nil, err
	}

	jsonParser := json.NewDecoder(c)
	if err = jsonParser.Decode(&projects); err != nil {
		return nil, err
	}

	return projects, nil
}

// Processing YouTube Requests
func getVideosByChannelID(token, channelID string) (result string, err error) {

	url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?"+
		"key=%s&channelId=%s&part=snippet,id&order=date&maxResults=50",
		token, channelID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal("NewRequest: ", err)
		return
	}

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", errors.New("YouTube response is: " + string(resp.StatusCode))
	}

	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	result = string(bodyBytes)

	totalResults := gjson.Get(result, "pageInfo.totalResults")

	if totalResults.Int() > 49 {
		return "", errors.New("Returned 50 videos, we could loose records")
	}
	return result, nil
}

func main() {

	token := os.Getenv("YOUTUBE_TOKEN")

	// TODO: delete
	now := time.Now().Format(time.RFC3339)

	channels, err := loadVideosConfig()
	if err != nil {
		log.Fatal("Error processing YouTube configuration: ", err)
	}

	var videos = videosType{}

	for _, c := range channels {

		var record string
		record, err = getVideosByChannelID(token, c.ChannelID)

		r := gjson.Get(record, "items")
		for _, item := range r.Array() {

			if gjson.Get(item.String(), "id.kind").String() != "youtube#video" {
				continue
			}

			videos = append(videos, video{
				title:       gjson.Get(item.String(), "snippet.title").String(),
				videoID:     gjson.Get(item.String(), "id.videoId").String(),
				channelID:   c.ChannelID,
				channelName: c.ChannelName,
				publishedAt: gjson.Get(item.String(), "snippet.publishedAt").
					String(),
			})
		}
	}

	err = generateVideosPage(videos)
	if err != nil {
		log.Fatal("Error generating Videos page: ", err)
	}

	// Update the videos landing page
	_ = os.Truncate(videosLandingPage, 0)
	var fileLanding, err3 = os.OpenFile(videosLandingPage, os.O_RDWR, 0644)
	if err3 != nil {
		log.Fatal("Not able to open ", videosLandingPage)
	}
	defer fileLanding.Close()

	s := `+++
date = "$now"
draft = false
title = "Charlas"
weight = 102
type = "post"
class="post last talks"

+++

A maioría de charlas está gravadas e dispoñibles para o seu visionado.
Están son as catro últimas:

<div class="container-fluid">
    <div class="row">

`
	fileLanding.WriteString(strings.Replace(s, "$now", now, 1))

	sort.Sort(sort.Reverse(videos))

	for i, v := range videos {

		s = fmt.Sprintf("* [%s](https://www.youtube.com/watch?v=%s) (%s)\n",
			v.title,
			v.videoID,
			v.channelName)

		//fileLanding.WriteString(s)

		s = fmt.Sprintf("<div class=\"col-xs-12 col-sm-6 video\">"+
			"<div class=\"embed-responsive "+
			" embed-responsive-16by9\"><iframe class=\"embed-responsive-item\""+
			" src=\"https://www.youtube.com/embed/%s\" "+
			"frameborder=\"0\" allowfullscreen></iframe></div></div>\n",
			v.videoID)

		fileLanding.WriteString(s)

		if i == 3 {
			break
		}
	}
	s = "\n\n</div></div>\n\n"
	fileLanding.WriteString(s)

	s = `<span class="view-more">
[Preme aquí para ver tódalas charlas](./page/videos/)
</span>`

	fileLanding.WriteString(s)

	// Prepare Proxectos file output
	projects, err := loadProjectsConfig()
	if err != nil {
		log.Fatal("Error processing Projects configuration: ", err)
	}

	_ = os.Truncate(projectsPage, 0)
	var fileProjects, err4 = os.OpenFile(projectsPage, os.O_RDWR, 0644)
	if err4 != nil {
		log.Fatal("Not able to open ", projectsPage)
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

	fileProjects.WriteString("<div class=\"container-fluid\">\n\n")

	for i, v := range projects {

		if i%2 == 0 {
			fileProjects.WriteString("<div class=\"row\">\n")
		}

		s = fmt.Sprintf("\n<div class=\"col-xs-12 col-sm-6\">"+
			"<div class=\"github-card\" data-user=\"%s\" "+
			"data-repo=\"%s\" data-width=\"100%%\"></div></div>\n",
			v.User,
			v.Repo)

		fileProjects.WriteString(s)

		if i%2 == 1 || len(projects)-1 == i {
			fileProjects.WriteString("</div>\n")
		}
	}
	fileProjects.WriteString("</div>\n\n")

	fileProjects.WriteString("<script src=\"" +
		"//cdn.jsdelivr.net/github-cards/latest/widget.js\"></script>")

	// Update the projects landing page
	_ = os.Truncate(projectsLandingPage, 0)
	var fileProjectsLanding, err5 = os.OpenFile(
		projectsLandingPage, os.O_RDWR, 0644)
	if err5 != nil {
		log.Fatal("Not able to open ", projectsLandingPage)
	}
	defer fileProjectsLanding.Close()

	s = `+++
date = "$now"
draft = false
title = "Proxectos"
weight = 103
type = "post"
class="post last projects"

+++

Proxectos de código aberto creados por xente da comunidade:
`
	fileProjectsLanding.WriteString(strings.Replace(s, "$now", now, 1))

	rand.Seed(time.Now().Unix())
	random := rand.Int()

	fileProjectsLanding.WriteString("<div class=\"container-fluid\">\n\n")

	for i := 0; i < 6; i++ {

		if i%2 == 0 {
			fileProjectsLanding.WriteString("<div class=\"row\">\n")
		}

		n := (random + i) % len(projects)
		s = fmt.Sprintf("\n<div class=\"col-xs-12 col-sm-6\">"+
			"<div class=\"github-card\" data-user=\"%s\" "+
			"data-repo=\"%s\" data-width=\"100%%\"></div></div>\n",
			projects[n].User,
			projects[n].Repo)

		fileProjectsLanding.WriteString(s)

		if i%2 == 1 {
			fileProjectsLanding.WriteString("</div>\n")
		}
	}

	fileProjectsLanding.WriteString("</div>\n\n")

	s = `
<span class="view-more">
[Preme aquí para ver tódolos proxectos](./page/proxectos/)
</span>

<script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
`
	fileProjectsLanding.WriteString(s)

}
