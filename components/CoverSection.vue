<template>
  <section id="cover">
    <div class="wrap container-fluid">
      <div class="row">
        <div class="col-xs-12 content-wrapper">
          <div class="content box">
            <img
              src="logo_white.jpg"
              alt="Vigo Tech Alliance"
              class="logo"
            >
            <h1>
              Vigo Tech Alliance
            </h1>

            <h2>
              Os grupos de tecnoloxía de Vigo facemos piña para promover a tecnoloxía na cidade
            </h2>

            <VigotechNextEvent
              v-if="nextEventsGroupsUpcoming.length > 0"
              :next-events-groups="nextEventsGroupsUpcoming"
            />

            <div class="down-wrapper">
              <a
                v-scroll-to="'#grupos'"
                href="#"
                class="down"
              >
                <i class="fa fa-chevron-down" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import VigotechNextEvent from "./VigotechNextEvent";
  import VigotechCurrentEvents from "./VigotechCurrentEvents";
  export default {
    name: 'CoverSection',
    components: {
      VigotechNextEvent,
      VigotechCurrentEvents
    },
    props: {
      nextEventsGroups: {
        type: [Array],
        required: false,
        default: () => []
      }
    },
    computed: {
      nextEventsGroupsUpcoming () {
        return this.nextEventsGroups.filter(group => group.nextEvent && +group.nextEvent.date >= +new Date()) || []
      }
    }


  }
</script>
