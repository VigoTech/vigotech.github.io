<template>
  <div>
    <CoverSection
      :next-events="nextEvents"
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

    <FriendsSection
      :friends="vigotechFriends"
      class="page-section red-bg"
    />
  </div>
</template>

<script>
  import VigotechMembersSection from '../components/VigotechMembersSection'
  import CoverSection from '../components/CoverSection'
  import CalendarSection from '../components/CalendarSection'
  import ConversationSection from '../components/ConversationSection'
  import VideosSection from '../components/VideosSection'
  import VigotechDocsSection from '../components/VigotechDocsSection'
  import FriendsSection from '../components/FriendsSection'

  export default {
    components: {
      VigotechDocsSection,
      VideosSection,
      ConversationSection,
      CoverSection,
      VigotechMembersSection,
      CalendarSection,
      FriendsSection

    },
    data() {
      return {
        docs: [],
        nextEventsStatic: [],
      }
    },
    computed: {
      vigotechStructure() {
        return this.$store.state.vigotechStructure
      },
      nextEventGroup() {
        return this.$store.getters.nextEventGroup
s     },
      nextEvents() {
        return this.$store.getters.nextEvents
      },
      vigotechFriends() {
        return this.$store.state.friends
      }
    },
    mounted() {
      if ($nuxt.$route.hash) {
        this.scrollToHash()
      }
    },
    serverPrefetch () {
      return this.fetchData()
    },
    methods: {
      fetchData () {
        this.$store.dispatch('loadData')
        return this.$store.dispatch('loadFriends')
      },
      scrollToHash () {
        var hash = $nuxt.$route.hash
        this.$nextTick(() => {
          this.$scrollTo(hash, 500)
        })
      }
    },

  }
</script>
