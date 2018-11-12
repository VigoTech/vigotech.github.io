<template>
  <section id="videos">
    <div class="wrap container-fluid">
      <div class="row">
        <div class="col-xs-12 content-wrapper">
          <h2
            v-sticky
            :z-index="100"
            :sticky-top="100"
            class="section-title"
          >
            <div>
              Charlas en video
            </div>
          </h2>

          <div class="section-content section-content-center">
            <p>A maioría de charlas está gravadas e dispoñibles para o seu visionado.</p>

            <div class="row">
              <div
                v-for="(video, key) in recentVideos"
                :key="key"
                class="col-xs-12 col-sm-6 video"
              >
                <VigotechVideoPlayer
                  :video="video"
                  :show-titles="true"
                />
              </div>
            </div>

            <a
              href="videos"
              class="btn btn-white"
            >
              Ver máis
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import VigotechVideoPlayer from '~/components/VigotechVideoPlayer'
  export default {
    name: 'VideosSection',
    components: {
      VigotechVideoPlayer
    },
    props: {
      vigotechStructure: {
        type: [Object],
        required: true
      }
    },
    data() {
      return {}
    },
    computed: {
      recentVideos() {
        return this.$store.getters.recentVideos
      }
    }
  }
</script>
