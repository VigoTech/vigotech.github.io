<template>
  <section
    id="grupos"
    class="wrap container-fluid"
  >
    <h2
      v-sticky
      :z-index="100"
      :sticky-top="100"
      class="section-title"
    >
      <div>
        Os grupos
      </div>
    </h2>
    <vigotech-member-list
      :members="vigotechStructure.members || {}"
    />
  </section>
</template>

<script>
  import VigotechMemberList from './VigotechMemberList'

  export default {
    name: 'VigotechMembersSection',
    components: {
      VigotechMemberList,
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
    methods: {}
  }
</script>

