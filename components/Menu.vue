<template>
  <nav id="menu">
    <a
      href="./"
      class="logo"
    >
      <img
        src="logo.svg"
        alt="Vigotech Alliance" >
    </a>
    <ul>
      <li>
        <a
          href="./#grupos"
          @click="handleMenuLink('#grupos', $event)"
        >
          Grupos
        </a>
      </li>
      <li>
        <a
          href="./#calendar"
          @click="handleMenuLink('#calendar', $event)"
        >
          Calendario
        </a>
      </li>
      <li>
        <a
          href="./#docs"
          @click="handleMenuLink('#docs', $event)"
        >
          Documentos
        </a>
      </li>
      <li>
        <a
          href="./#videos"
          @click="handleMenuLink('#videos', $event)"
        >
          Videos
        </a>
      </li>
      <li>
        <a
          href="./#conversation"
          @click="handleMenuLink('#conversation', $event)"
        >
          Únete a conversa
        </a>
      </li>
      <li v-if="Object.keys(vigotechFriends).length > 0">
        <a
          href="./#friends"
          @click="handleMenuLink('#friends', $event)"
        >
          Os nosos amigos
        </a>
      </li>

    </ul>
  </nav>
</template>

<script>
  export default {
    name: 'Menu',
    computed: {
      vigotechFriends() {
        return this.$store.state.friends
      }
    },
    methods: {
      handleMenuLink(hash, event) {
        const path = $nuxt.$route.path
          if (path == '/') {
            event.preventDefault();
            this.$scrollTo(hash, 500)
          }
      }
    }
  }
</script>
