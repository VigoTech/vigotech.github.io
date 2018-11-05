<template>
  <div :key="$route.params.slug">

    <PageHeader :title="$route.params.slug" />

    <section id="post">
      <div class="wrap container-fluid">
        <div class="row">
          <div class="col-xs-12 content-wrapper">
            <div class="post-content">
              <div
                v-html="content"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import PageHeader from '~/components/PageHeader'
  export default {
    components: {
      PageHeader
    },
    async asyncData({params}) {
      const fileContent = await import(`~/markdown/${params.slug}.md`)
      return {
        content: fileContent.default
      }
    }
  }
</script>

