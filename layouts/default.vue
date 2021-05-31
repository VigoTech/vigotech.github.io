<template>
  <div>
    <nuxt/>
    <Menu />
    <footer id="page-footer">
      <a
        href="https://vigotech.org"
        class="vigotech-claim vigotech-dark"
      >
        Feito con <i class="vt-pinecone" /> en <strong>Vigo</strong>
      </a>

      <div class="spacer" />
      <div class="social">
        <a
          v-for="(item, index) in $store.state.config.social"
          :key="index"
          :href="item.link"
          :title="item.title"
        >
          <i :class="`${item.icon}`" />
        </a>
      </div>

    </footer>

    <vue-cookie-accept-decline
      ref="cookieBanner"
      :disable-decline="false"
      :transition-name="'slideFromBottom'"
      :show-postpone-button="true"
      :debug="false"
      position="bottom-left"
      type="floating"
      element-id="cookie-banner"
      @status="onCookieStatus"
      @clicked-accept="onCookieClickedAccept"
    >
      <div slot="postponeContent">
        &times;
      </div>

      <div slot="message">
        Empregamos cookies propias e de terceiros para mellorar a experiencia de usuario. <router-link to="/post/legal">Saber máis</router-link>
      </div>

      <div slot="declineContent">
        Non acepto
      </div>

      <div slot="acceptContent">
        Ok, adiante
      </div>
    </vue-cookie-accept-decline>
  </div>
</template>

<script>
  import Menu from '~/components/Menu'
  export default {
    components: {
      Menu
    },
    serverPrefetch () {
      return this.fetchData()
    },
    methods: {
      onCookieStatus(status) {
        this.$store.commit('setCookieStatus', status);
        if (status == 'accept') {
          this.$ga.enable();
          this.$ga.page(this.$router);
        }
      },
      onCookieClickedAccept() {},
      async fetchData () {
        await this.$store.dispatch('loadConfig')
        await this.$store.dispatch('loadData')
        return this.$store.dispatch('loadFriends')
      }
    }
  }
</script>
