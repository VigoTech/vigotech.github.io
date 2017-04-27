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

    final static def talks = []

    static def clearFile(String file) {
        PrintWriter writer = new PrintWriter(file)
        writer.print("")
        writer.close()
    }

    static main(String[] args) {
        def env = System.getenv()
        def token = env['YOUTUBE_TOKEN']

        // Generate "Charlas" page

        clearFile('content/page/videos.md')
        def page = new File('content/page/videos.md')

        DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");
        def now = ZonedDateTime.now().format(FORMATTER)

        page << """+++
date = "$now"
draft = false
title = "Charlas"
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
            // println prettyPrint(toJson(resp.data))
            assert resp.data.pageInfo.totalResults < 50: "Some entries could be missed."

            page << lineSeparator << lineSeparator
            page << "### [$channelName](https://www.youtube.com/channel/$channelId)" << lineSeparator

            resp.data.items.each() {
                if (it.id.kind == 'youtube#video') {
                    page << "- [$it.snippet.title](https://www.youtube.com/watch?v=$it.id.videoId)" << lineSeparator
                    talks << [title: it.snippet.title, id: it.id.videoId, channel: channelName, date: it.snippet.publishedAt]
                    // println it.snippet.description
                }
            }

        }

        page << '''
### [Sysadmin@Galicia](https://replay.teltek.es/series/58af67c7a7bc283f008b456c)

 - [2017040601 - Otro Ejemplo de Docker en Producción, con Minecraft](https://replay.teltek.es/video/58e7a055a7bc2890008b45f7)
 - [2017040602 - Auditorias de seguridad para sitios web](https://replay.teltek.es/video/58e7a05fa7bc282c028b4599)
 - [2017022301 - Automatizacion para todos](https://replay.teltek.es/video/58bf2b9fa7bc2847008b4667)
 - [2017022302 - Trucos configurando Nginx con PHP](https://replay.teltek.es/video/58bf2baba7bc283e008b468b)
 - [2017012601 - Contenerización de servicios en producción con Docker](https://replay.teltek.es/video/58af67a9a7bc2842008b4569)
 
 
 '''

        // Generate landing page

        clearFile('content/post/vigotech-charlas.md')
        def landingPage = new File('content/post/vigotech-charlas.md')

        landingPage << """+++
date = "$now"
draft = false
title = "Charlas"
weight = 102
type = "post"
class="post last"

+++
"""


        talks.sort{a, b -> b.date.compareTo(a.date)}[0..2].each{
            landingPage << "$it.channel - [$it.title](https://www.youtube.com/watch?v=$it.id)" << lineSeparator << lineSeparator
            landingPage << "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/$it.id\" frameborder=\"0\" allowfullscreen></iframe>"
            landingPage << lineSeparator
            landingPage << lineSeparator
        }

        landingPage << lineSeparator

        landingPage << '*[Pincha aquí para ver todas as charlas](./page/videos/)*'
    }
}
