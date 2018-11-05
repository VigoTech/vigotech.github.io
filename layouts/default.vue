<template>
  <div>
    <nuxt/>
    <Menu />
    <footer id="page-footer">
      <p>Tema personalizado pola empresa local Opsou.</p>
      <a
        href="https://vigotech.org"
        class="vigotech-claim vigotech-dark">
        Feito con <i class="vt-pinecone" /> en <strong>Vigo</strong>
      </a>
    </footer>
  </div>
</template>

<script>
  import Menu from '~/components/Menu'
  export default {
    components: {
      Menu
    }
  }
</script>
