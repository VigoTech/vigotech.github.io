<template>
  <header
    v-sticky
    :z-index="100"
    :sticky-top="100"
    class="page-header container-fluid"
  >
    <div class="page-header-content row">
      <div class="col-xs-3">
        <a href="/">
          <img
            src="logo.png"
            alt="Vigotech Alliance"
          >
        </a>
      </div>
      <div class="col-xs-8">
        <h1 class="page-title">
          {{ title }}
        </h1>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'PageHeader',
    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
</script>
