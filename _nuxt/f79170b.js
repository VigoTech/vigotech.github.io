(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{425:function(e,t,r){"use strict";var o={name:"PageHeader",props:{title:{type:String,required:!0}}},n=r(24),component=Object(n.a)(o,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("header",{directives:[{name:"sticky",rawName:"v-sticky"}],staticClass:"page-header",attrs:{"z-index":100,"sticky-top":100}},[r("div",{staticClass:"page-header-content"},[e._m(0),e._v(" "),r("div",{staticClass:"spacer"}),e._v(" "),r("h1",{staticClass:"page-title"},[e._v("\n      "+e._s(e.title)+"\n    ")])])])}),[function(){var e=this.$createElement,t=this._self._c||e;return t("a",{staticClass:"logo",attrs:{href:"/"}},[t("img",{attrs:{src:"logo.png",alt:"Vigotech Alliance"}})])}],!1,null,null,null);t.a=component.exports},426:function(e,t,r){"use strict";var o=r(0),n=r.n(o),l={name:"VigotechVideoPlayer",props:{video:{type:[Object],required:!0},preferExternal:{type:Boolean,default:!1},showTitles:{type:Boolean,default:!1}},methods:{getVideoOptions:function(video){return{sources:[{type:"video/mp4",src:video.src}],poster:video.thumbnail}},pubDate:function(e){return n()(e).format("dddd, D MMMM YYYY")}}},c=r(24),component=Object(c.a)(l,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",["youtube"==e.video.player?r("div",[e.preferExternal?r("a",{attrs:{href:"//www.youtube.com/watch?v="+e.video.id,target:"_blank"}},[r("img",{attrs:{src:e.video.thumbnails.medium.url}}),e._v(" "),r("h3",[e._v(e._s(e.pubDate(e.video.pubDate)))]),e._v(" "),r("h2",[e._v(e._s(e.video.title))])]):r("div",[r("div",{staticClass:"embed-responsive  embed-responsive-16by9"},[r("iframe",{staticClass:"embed-responsive-item",attrs:{src:"//www.youtube-nocookie.com/embed/"+e.video.id,frameborder:"0",allowfullscreen:""}})]),e._v(" "),e.showTitles?r("h3",[e._v(e._s(e.pubDate(e.video.pubDate)))]):e._e(),e._v(" "),e.showTitles?r("h2",[e._v(e._s(e.video.title))]):e._e()])]):e._e(),e._v(" "),"native"==e.video.player?r("div",{staticClass:"video-player-container"},[r("no-ssr",[r("div",{directives:[{name:"video-player",rawName:"v-video-player:videoPlayer",value:e.getVideoOptions(e.video),expression:"getVideoOptions(video)",arg:"videoPlayer"}],staticClass:"video-player-box embed-responsive  embed-responsive-16by9",attrs:{playsinline:!0}}),e._v(" "),e.showTitles?r("h3",[e._v(e._s(e.pubDate(e.video.pubDate)))]):e._e(),e._v(" "),e.showTitles?r("h2",[e._v(e._s(e.video.title))]):e._e()])],1):e._e(),e._v(" "),"teltek"==e.video.player?r("div",{staticClass:"embed-responsive  embed-responsive-16by9"},[r("iframe",{staticClass:"embed-responsive-item",attrs:{src:"https://replay.teltek.es/iframe/"+e.video.id,allowfullscreen:"",frameborder:"0"}}),e._v(" "),e.showTitles?r("h3",[e._v(e._s(e.pubDate(e.video.pubDate)))]):e._e(),e._v(" "),e.showTitles?r("h2",[e._v(e._s(e.video.title))]):e._e()]):e._e()])}),[],!1,null,null,null);t.a=component.exports},435:function(e,t,r){"use strict";r.r(t);r(29);var o=r(425),n={components:{VigotechVideoPlayer:r(426).a,PageHeader:o.a},data:function(){return{}},computed:{videosByGroup:function(){var e=this,t=[],r=function(r){var o=JSON.parse(JSON.stringify(e.vigotechStructure.members[r])),n=[];for(var l in o.videoList){var video=o.videoList[l];n[video.pubDate]=video}var c={};Object.keys(n).sort().reverse().forEach((function(e){c[e]=n[e]})),Object.keys(c).length>0&&(o.videoList=c,o.key=r,t.push(o))};for(var o in this.vigotechStructure.members)r(o);return t},vigotechStructure:function(){return this.$store.state.vigotechStructure}}},l=r(24),component=Object(l.a)(n,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("PageHeader",{attrs:{title:"Charlas en vídeo"}}),e._v(" "),r("section",{attrs:{id:"videos"}},[r("div",{staticClass:"wrap container-fluid group-anchors"},e._l(e.videosByGroup,(function(e,t){return r("a",{key:t,staticClass:"group-anchor",attrs:{href:"/videos#group-"+e.key}},[r("img",{staticClass:"member-logo",attrs:{src:e.logo,alt:e.name}})])})),0),e._v(" "),r("div",{staticClass:"wrap container-fluid"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-xs-12 content-wrapper"},[r("div",{staticClass:"section-content section-content-center"},e._l(e.videosByGroup,(function(t,o){return r("section",{key:o,staticClass:"group"},[r("a",{staticClass:"anchor",attrs:{name:"group-"+t.key}}),e._v(" "),r("header",{staticClass:"group-header"},[r("div",{staticClass:"logo-wrapper"},[r("img",{staticClass:"member-logo",attrs:{src:t.logo,alt:t.name}})]),e._v(" "),r("div",{staticClass:"header-content"},[r("h2",[e._v(e._s(t.name))])])]),e._v(" "),r("div",{staticClass:"row"},e._l(t.videoList,(function(video,e){return r("article",{key:e,staticClass:"col-xs-12 col-sm-6 col-md-4 video"},[r("VigotechVideoPlayer",{staticClass:"box",attrs:{video:video,"prefer-external":!0,"show-titles":!0}})],1)})),0),e._v(" "),e._l(t.videos,(function(t,o){return["youtube"==t.type?r("a",{key:"youtube-"+o,staticClass:"btn",attrs:{href:"https://www.youtube.com/channel/"+t.channel_id}},[e._v("\n                  Ver todos os vídeos do grupo\n                ")]):e._e()]}))],2)})),0)])])])])],1)}),[],!1,null,null,null);t.default=component.exports}}]);