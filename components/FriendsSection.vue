<template>
  <section id="friends">
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
              Os nosos amigos
            </div>
          </h2>
        </div>
      </div>
      <div class="row center-xs">
        <div
          v-for="(friend, key) in friends"
          :key="key"
          class="col-xs-4 col-sm-3 col-md-2 col-lg-1"
        >
          <Friend :friend="friend" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Friend from './Friend'
  export default {
    name: 'FriendsSection',
    components: {
      Friend
    },
    props: {
      friends: {
        type: Object,
        required: true
      }
    }
  }
</script>
