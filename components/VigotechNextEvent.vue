<template>
  <div class="vigotech-next-event">
    <h4>
      <i class="fa fa-calendar" /> Vindeiro evento
    </h4>



    <div class="wrapper">
      <div class="logo-wrapper">
        <a :href="nextEventGroup.nextEvent.url">
          <img
            :src="nextEventGroup.logo"
            :alt="nextEventGroup.name"
            class="member-logo"
          >
        </a>
      </div>
      <div class="next-event-content">
        <a :href="nextEventGroup.nextEvent.url">
          <h6>{{ nextEventGroup.name }}</h6>
          <h5>{{ nextEventGroup.nextEvent.title }}</h5>
          <strong>{{ eventDate }}</strong>
          <span class="btn">
            Máis info
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    props: {
      nextEventGroup: {
        type: [Object],
        required: false,
        default: () => {return {}}
      }
    },
    computed: {
      eventDate () {
        return moment(this.nextEventGroup.nextEvent.date).format('dddd, D MMMM YYYY HH:mm')
      }
    }
  }
</script>
