<template>
  <div>
    <CoverSection
      :next-events="(nextEvents || nextEventsStatic)"
      class="page-section"
    />
    <VigotechMembersSection
      :vigotech-structure="vigotechStructure"
      class="page-section"
    />
    <CalendarSection class="page-section red-bg"/>

    <VigotechDocsSection
      class="page-section"
    />
    <VideosSection
      :vigotech-structure="vigotechStructure"
      class="page-section red-bg"
    />

    <ConversationSection class="page-section"/>
  </div>
</template>

<script>
  import VigotechMembersSection from '../components/VigotechMembersSection'
  import CoverSection from '../components/CoverSection'
  import CalendarSection from '../components/CalendarSection'
  import ConversationSection from '../components/ConversationSection'
  import VideosSection from '../components/VideosSection'
  import VigotechStructureStatic from '../static/vigotech-generated'
  import VigotechDocsSection from '../components/VigotechDocsSection'

  export default {
    components: {
      VigotechDocsSection,
      VideosSection,
      ConversationSection,
      CoverSection,
      VigotechMembersSection,
      CalendarSection
    },
    data() {
      return {
        vigotechStructure: {
          members: {}
        },
        docs: [],
        nextEventsStatic: []
      }
    },
    computed: {
      vigotechStructureStore() {
        // Need separate Store value from data value, because of SSR.
        // asyncData copy values to data and don'y allow to use computed directly
        return this.$store.state.vigotechStructure
      },
      nextEventGroup() {
        return this.$store.getters.nextEventGroup
s     },
      nextEvents() {
        return this.$store.getters.nextEvents
      }
    },
    watch: {
      vigotechStructureStore(newValue, oldValue) {
        // Need separate Store value from data value, because of SSR.
        // asyncData copy values to data and don'y allow to use computed directly
        this.vigotechStructure = newValue
      }
    },
    mounted() {
      this.$store.dispatch('loadData')

      if ($nuxt.$route.hash) {
        this.scrollToHash()
      }
    },
    async asyncData(context) {
      context.app.store.commit('loadData', VigotechStructureStatic)
      return {
        vigotechStructure: VigotechStructureStatic,
        nextEventsStatic: context.app.store.getters.nextEvents
      }
    },
    methods: {
      scrollToHash () {
        var hash = $nuxt.$route.hash
        this.$nextTick(() => {
          this.$scrollTo(hash, 500)
        })
      }
    },

  }
</script>
