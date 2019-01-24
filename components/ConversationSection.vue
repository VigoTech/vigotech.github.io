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
              Únete a conversa
            </div>
          </h2>

          <div class="social">
            <a
              href="http://twitter.com/vigotechallianc"
              title="Twitter"
            >
              <i class="fa fa-twitter fa-2x" />
            </a>

            <a
              href="mailto:alliance@vigotech.org"
              title="Email alliance@vigotech.org"
            >
              <i class="fa fa-envelope-o fa-2x" />
            </a>

            <a
              href="https://github.com/VigoTech"
              title="GitHub"
            >
              <i class="fa fa-github fa-2x" />
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
                    href="https://slackin-vigotech.herokuapp.com/"
                    class="btn"
                  >
                    Consegue unha invitación no teu correo clickando aquí
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
