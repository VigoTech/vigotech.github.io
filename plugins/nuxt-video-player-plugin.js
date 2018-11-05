import Vue from 'vue'

// const VueVideoPlayer = require('vue-video-player/dist/ssr')
// Vue.use(VueVideoPlayer)

if (process.browser) {
  const VueVideoPlayer = require('vue-video-player/dist/ssr')
  Vue.use(VueVideoPlayer)
}
