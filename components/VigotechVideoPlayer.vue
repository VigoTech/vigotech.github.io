<template>
  <div>
    <div v-if="video.player== 'youtube'">
      <a
        v-if="preferExternal"
        :href="`//www.youtube.com/watch?v=${video.id}`"
        target="_blank"
      >
        <img :src="video.thumbnails.medium.url">
        <h3>{{ pubDate(video.pubDate) }}</h3>
        <h2>{{ video.title }}</h2>
      </a>

      <div v-else>
        <div
          class="embed-responsive  embed-responsive-16by9"
        >
          <iframe
            :src="`//www.youtube-nocookie.com/embed/${video.id}`"
            class="embed-responsive-item"
            frameborder="0"
            allowfullscreen=""
          />
        </div>
        <h3 v-if="showTitles">{{ pubDate(video.pubDate) }}</h3>
        <h2 v-if="showTitles">{{ video.title }}</h2>
      </div>
    </div>

    <div
      v-if="video.player == 'native'"
      class="video-player-container"
    >
      <no-ssr>
        <div
          v-video-player:videoPlayer="getVideoOptions(video)"
          :playsinline="true"
          class="video-player-box embed-responsive  embed-responsive-16by9"
        />
        <h3 v-if="showTitles">{{ pubDate(video.pubDate) }}</h3>
        <h2 v-if="showTitles">{{ video.title }}</h2>
      </no-ssr>
    </div>


    <div
      v-if="video.player== 'teltek'"
      class="embed-responsive  embed-responsive-16by9"
    >
      <iframe
        :src="`https://replay.teltek.es/videoplayer/${video.id}?autostart=false`"
        class="embed-responsive-item"
        frameborder="0"
      />
      <h3 v-if="showTitles">{{ pubDate(video.pubDate) }}</h3>
      <h2 v-if="showTitles">{{ video.title }}</h2>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'VigotechVideoPlayer',
    props: {
      video: {
        type: [Object],
        required: true
      },
      preferExternal: {
        type: Boolean,
        default: false
      },
      showTitles: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getVideoOptions(video) {
        return {
          sources: [{
            type: 'video/mp4',
            src: video.src
          }],
          poster: video.thumbnail
        }
      },
      pubDate(date) {
        return moment(date).format('dddd, D MMMM YYYY')
      }
    }
  }
</script>
