<template>
  <div class="vigotech-next-event vigotech-next-event-active">
    <h4>
      <i class="fa fa-calendar" />
      <span v-if="nextEventsGroups.length == 1">Evento activo</span>
      <span v-else>Eventos en curso</span>
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
          <strong>{{ eventDate(nextEventGroup.nextEvent.date) }}</strong>
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
