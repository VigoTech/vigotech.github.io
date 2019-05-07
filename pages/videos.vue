<template>
  <div>
    <PageHeader title="Charlas en video" />

    <section id="videos">

      <div class="wrap container-fluid group-anchors">
        <a
          v-for="(group, groupkey) in videosByGroup"
          :href="`/videos#group-${group.key}`"
          :key="groupkey"
          class="group-anchor"
        >
          <img
            :src="group.logo"
            :alt="group.name"
            class="member-logo"
          >
        </a>
      </div>


      <div class="wrap container-fluid">
        <div class="row">
          <div class="col-xs-12 content-wrapper">
            <div class="section-content section-content-center">
              <section
                v-for="(group, groupkey) in videosByGroup"
                :key="groupkey"
                class="group"
              >
                <a
                  :name="`group-${group.key}`"
                  class="anchor"
                />
                <header class="group-header">
                  <div class="logo-wrapper">
                    <img
                      :src="group.logo"
                      :alt="group.name"
                      class="member-logo"
                    >
                  </div>
                  <div class="header-content">
                    <h2>{{ group.name }}</h2>
                  </div>
                </header>

                <div class="row">
                  <article
                    v-for="(video, key) in group.videoList"
                    :key="key"
                    class="col-xs-12 col-sm-6 col-md-4 video"
                  >
                    <VigotechVideoPlayer
                      :video="video"
                      :prefer-external="true"
                      :show-titles="true"
                    />
                  </article>
                </div>

                <a
                  v-for="(videoSource, key) in group.videos"
                  v-if="videoSource.type == 'youtube'"
                  :key="key"
                  :href="`https://www.youtube.com/channel/${videoSource.channel_id}`"
                  class="btn"
                >
                  Ver todos os videos do grupo
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader'
  import VigotechVideoPlayer from "../components/VigotechVideoPlayer";

  export default {
    components: {
      VigotechVideoPlayer,
      PageHeader
    },
    data() {
      return {}
    },
    computed: {
      videosByGroup () {
        const groups = []

        for(let groupKey in this.vigotechStructure.members) {
          let group = JSON.parse(JSON.stringify(this.vigotechStructure.members[groupKey]))
          const videos = []


          for(let videoKey in group.videoList) {
            let video = group.videoList[videoKey]
            videos[video.pubDate] = video
          }

          //Sort by pubdate
          const videosSortedByDate = {};
          Object.keys(videos).sort().reverse().forEach(function(key) {
            videosSortedByDate[key] = videos[key];
          });

          if (Object.keys(videosSortedByDate).length > 0) {
            group.videoList = videosSortedByDate
            group.key = groupKey
            groups.push(group);
          }
        }
        return groups
      },
      vigotechStructure() {
        return this.$store.state.vigotechStructure
      },
    },
    mounted() {
    },
    serverPrefetch () {
      return this.fetchData()
    },
    methods: {
      fetchData() {
        return this.$store.dispatch('loadData')
      }
    }
  }
</script>
