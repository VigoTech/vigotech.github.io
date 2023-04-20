<template>
  <section id="conversation">
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
              Únete á conversa
            </div>
          </h2>

          <div class="social">
            <a
              v-for="(item, index) in $store.state.config.social"
              :key="index"
              :href="item.link"
              :title="item.title"
            >
              <i :class="`${item.icon} fa-2x`" />
            </a>
          </div>

          <div class="row">
            <div class="col-xs-12 col-sm-6 col">
              <div class="section-content section-content-center">
                <p>Aberto a todo o mundo, é o punto de encontro virtual de todos os grupos e un bo sitio para facer un pouco de networking:</p>

                <p>
                  <a href="https://vigotechalliance.slack.com">
                    <img
                      src="slack.png"
                      alt="Slack"
                    >
                  </a>
                </p>

                <p>
                  <a
                    href="https://join.slack.com/t/vigotechalliance/shared_invite/zt-7gf7yva8-NXwept0hujWdc3W4S2B8TQ"
                    class="btn"
                  >
                    Consegue unha invitación no teu correo premendo aquí
                  </a>
                </p>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col">
              <a
                class="twitter-timeline"
                data-theme="light"
                data-height="400"
                data-width="400"
                data-border-color="#e84a5f"
                data-chrome="nofooter"
                href="https://twitter.com/VigoTechAllianc?ref_src=twsrc%5Etfw"
              >
                Tweets by VigoTech Alliance
              </a>
              <script
                v-if="cookieStatus"
                async
                src="https://platform.twitter.com/widgets.js"
                charset="utf-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'ConversationSection',
    computed: {
      cookieStatus() {
        return this.$store.state.cookieStatus
      }
    }
  }
</script>
