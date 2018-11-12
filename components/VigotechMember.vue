<template>
  <div class="vigotech-member">

    <div class="logo-wrapper">
      <div class="logo-content">
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==
  "
          class="square-bg"
        >
        <img
          :src="member.logo"
          :alt="member.name"
          class="logo"
        >

        <VigotechNextEventTip
          v-if="showNextEvent && member.nextEvent && member.nextEvent.date > new Date().getTime()"
          :next-event="member.nextEvent"
          class="next-event"
        />
      </div>
    </div>
    <h4 class="name">
      {{ member.name }}
    </h4>
    <div class="links">
      <a
        v-for="(link, key) in member.links"
        :key="key"
        :href="link"
        class="link"
        target="_blank"
      >
        <i :class="key|toFontAwesome" />
      </a>
    </div>
  </div>
</template>

<script>
  import VigotechNextEventTip from './VigotechNextEventTip'

  const icons = {
    web: 'globe'
  }
  export default {
    name: 'VigotechMember',
    components: {
      VigotechNextEventTip
    },
    filters: {
      toFontAwesome: function (value) {
        if (!value) return ''
        if (icons[value] !== undefined) {
          value = icons[value]
        }

        return `fa fa-${value}`
      }
    },
    props: {
      member: {
        type: Object,
        required: true,
      },
      showNextEvent: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>

<style scoped lang="scss">
  .vigotech-member {
    margin-bottom: 50px;
  }

  .name {
    display: block;
    text-align: center;
    font-size: 18px;
    line-height: 1.1em;
    margin: 0 0 7px 0;
    font-weight: normal;
  }

  .links {
    text-align: center;
    a {
      font-size: 24px;
      text-decoration: none;
      color: #000;
      padding: 0 2px 5px 2px;

      &:hover {
        color: #c8123a;
      }
    }
  }

  .logo-wrapper {
    margin-bottom: 20px;
    position: relative;
    .square-bg {
      width: 160px;
      max-width: 100%;
      height: auto;
    }
    .logo {
      max-width: 160px;
      width: 100%;
      display: block;
      left: 0;
      right: 0;
      top: 50%;
      margin: auto;
      position: absolute;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }

  .next-event {
    display: inline-block;
  }
</style>
