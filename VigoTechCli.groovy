import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@Grab('org.codehaus.groovy.modules.http-builder:http-builder:0.7')

import static groovy.json.JsonOutput.*
import groovyx.net.http.RESTClient

class VigoTechCli {

    final static String lineSeparator = System.getProperty('line.separator')

    final static def groups = [
            AgileVigo: 'UC4NkKB1iCLN9Nb3s8ydFc0w',
            JavascriptVigo: 'UCjFplxtEs0XtunTn-n0LUtQ',
            PHPVigo: 'UCzcSOwRc7bfKs9jPehJRNxQ',
            PythonVigo: 'UCTUXabChakosnupWEnz4xTA',
            VigoJUG: 'UCNOihTnorv6dZDANaPXgx_g',
            VigoLabs: 'UCBuC6QDQm4U60KV5QPED-eQ',
            ]

    static def clearFile(String file) {
        PrintWriter writer = new PrintWriter(file)
        writer.print("")
        writer.close()
    }

    static main(String[] args) {
        def env = System.getenv()
        def token = env['YOUTUBE_TOKEN']

        clearFile('content/page/videos.md')
        def page = new File('content/page/videos.md')

        DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");
        def now = ZonedDateTime.now().format(FORMATTER)

        page << """+++
date = "$now"
draft = false
title = "Videos"
type = "page"
weight = 1
+++

----
"""

        def youtube = new RESTClient('https://www.googleapis.com')

        groups.each { channelName, channelId ->

            def resp = youtube.get(path: '/youtube/v3/search',
                    query: [
                            key       : token,
                            channelId : channelId,
                            part      : 'snippet,id',
                            order     : 'date',
                            maxResults: 50,
                    ])

            assert resp.status == 200
            //println prettyPrint(toJson(resp.data))
            assert resp.data.pageInfo.totalResults < 50: "Some entries could be missed."

            page << lineSeparator << lineSeparator
            page << "### [$channelName](https://www.youtube.com/channel/$channelId)" << lineSeparator

            resp.data.items.each() {
                if (it.id.kind == 'youtube#video') {
                    page << "- [$it.snippet.title](https://www.youtube.com/watch?v=$it.id.videoId)" << lineSeparator
                    // println it.snippet.description
                }
            }
        }

    }
}
