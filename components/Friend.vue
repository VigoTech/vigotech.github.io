<template>
  <div class="vigotech-friend">
    <div class="logo-wrapper">
      <div class="logo-content">
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==
  "
          class="square-bg"
        >
        <a :href="friend.link">
          <img
            :src="friend.logo"
            :alt="friend.name"
            class="logo"
          >
        </a>
      </div>
    </div>
    <h4 class="name">
      <a :href="friend.link">
        {{ friend.name }}
      </a>
    </h4>
  </div>
</template>

<script>
  export default {
    name: 'VigotechFriend',
    props: {
      friend: {
        type: Object,
        required: true,
      }
    }
  }
</script>

