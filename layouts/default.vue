<template>
  <div>
    <nuxt/>
    <Menu />
    <footer id="page-footer">
      <p>Tema personalizado pola empresa local Opsou.</p>
      <a
        href="https://vigotech.org"
        class="vigotech-claim vigotech-dark"
      >
        Feito con <i class="vt-pinecone" /> en <strong>Vigo</strong>
      </a>
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
      <!-- Optional -->
      <div slot="postponeContent">
        &times;
      </div>

      <!-- Optional -->
      <div slot="message">
        Empregamos cookies propias e de terceiros para mellorar a experiencia de usuario. <router-link to="/post/legal">Saber máis</router-link>
      </div>

      <!-- Optional -->
      <div slot="declineContent">
        Non acepto
      </div>

      <!-- Optional -->
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
    methods: {
      onCookieStatus(status) {
        this.$store.commit('setCookieStatus', status);
        if (status == 'accept') {
          this.$ga.enable();
          this.$ga.page(this.$router);
        }
      },
      onCookieClickedAccept() {

      },

    }
  }
</script>
