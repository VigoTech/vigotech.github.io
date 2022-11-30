<template>
  <div class="vigotech-next-event">
    <a
      v-if="nextEvent.title"
      :href="nextEvent.url"
      :title="fullTitle"
      :date="nextEvent.date"
    >
      <i class="fa fa-calendar" />
    </a>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'VigotechNextEvent',
    props: {
      nextEvent: {
        type: Object,
        default() {
          return {
            url: '',
            title: '',
            date: null
          }
        }
      }
    },
    computed: {
      fullTitle () {
        return `${this.nextEvent.title}\n${moment(this.nextEvent.date).format('dddd, D MMMM YYYY HH:mm')}${this.nextEvent.location ? `\n${this.nextEvent.location}`: ''}`
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/_variables.scss";
  i {
    background: $primary-color;
    padding: 10px;
    border-radius: 999px;
    color: $white;
    font-size: 20px;
  }
</style>
