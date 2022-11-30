<template>
  <article class="vigotech-next-event">
    <h4>
      <i class="fa fa-calendar" />
      <span v-if="nextEventsGroups.length == 1">Vindeiro evento</span>
      <span v-else>Vindeiros eventos</span>
    </h4>

    <div
      v-for="(nextEventGroup, key) in nextEventsGroups"
      :key="key"
      class="wrapper"
    >

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
          <footer>
            <strong>{{ eventDate(nextEventGroup.nextEvent.date) }}</strong>
            <span class="btn">
              Máis info
            </span>
          </footer>

          <h6 v-if="nextEventGroup.nextEvent.location" class="vigotech-next-event__location">
            <i class="fa fa-map-pin"></i> {{ nextEventGroup.nextEvent.location }}
          </h6>
        </a>
      </div>
    </div>
  </article>
</template>

<script>
  import moment from 'moment'
  export default {
    props: {
      nextEventsGroups: {
        type: [Array],
        required: false,
        default: () => {return []}
      }
    },
    methods: {
      eventDate(date) {
        return moment(date).format('dddd, D MMMM YYYY HH:mm')
      }
    }
  }
</script>
