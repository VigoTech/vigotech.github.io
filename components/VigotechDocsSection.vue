<template>
  <section id="docs">
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
              Documentos
            </div>
          </h2>

          <div class="section-content section-content-center">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col">
                <a
                  href="https://github.com/VigoTech/documentos/blob/master/manifiesto.md"
                  class="btn btn-block btn-lg"
                >
                  Manifesto
                </a>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col">
                <a
                  href="https://github.com/VigoTech/documentos/blob/master/codigodeconducta.md"
                  class="btn btn-block btn-lg"
                >
                  Código de conducta
                </a>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col">
                <a
                  href="https://github.com/VigoTech/documentos/blob/master/condicionsentrada.md"
                  class="btn btn-block btn-lg"
                >
                  Condicións de entrada
                </a>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col">
                <a
                  href="https://github.com/VigoTech/documentos/blob/master/conducta_slack.md"
                  class="btn btn-block btn-lg"
                >
                  Código de conducta en Slack
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  // import docs from '../docs'
  export default {
    name: 'VigotechDocsSection',
  }
</script>
