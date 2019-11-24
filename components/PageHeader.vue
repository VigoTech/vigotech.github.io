<template>
  <header
    v-sticky
    :z-index="100"
    :sticky-top="100"
    class="page-header"
  >
    <div class="page-header-content">
      <a
        href="/"
        class="logo"
      >
        <img
          src="logo.png"
          alt="Vigotech Alliance"
        >
      </a>
      <div class="spacer" />
      <h1 class="page-title">
        {{ title }}
      </h1>
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
