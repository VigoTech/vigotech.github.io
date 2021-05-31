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
        rel="noopener"
      >
        <template v-if="key === 'ivoox'">
          <svg class="ivoox" width="22" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               viewBox="0 0 159.1 151" style="enable-background:new 0 0 159.1 151;" xml:space="preserve">
<path class="st0" d="M-254.3,230.3c0.2,0.3,0.5,0.5,0.8,0.8C-254.1,231.1-254.4,230.9-254.3,230.3z" fill="currentColor"/>
            <path d="M66.9,149.6c-28.8-4.2-58.4-29.9-61.6-67.1C1.6,38.7,34.1,5.5,70.8,1.1c44.3-5.2,79.3,27,84,64.8
	c5.4,43.5-25.4,77.6-60.8,83.8c0-0.6-0.1-1.1-0.1-1.7c0-19.3,0-38.6,0-57.9c0-10.5,0.1-21,0.1-31.6c0-3.4-0.9-6.5-3.9-8.2
	c-1.7-1-3.8-1.7-5.8-1.8c-13.3-0.2-26.6-0.1-39.8-0.1c-1.4,0-1.8,0.5-1.8,1.9c0.1,7.6,0.1,15.2,0,22.8c0,1.4,0.4,1.8,1.8,1.8
	c6.6-0.1,13.2,0,19.8,0c2.3,0,2.3,0,2.3,2.4c0,23.5,0.1,47,0.1,70.4C66.9,148.4,66.9,149,66.9,149.6z M79.4,42.4
	c8.5,0,15.1-6.5,15.1-15c0-8.3-6.6-15-14.9-15c-8.5,0-15.1,6.5-15.1,14.9C64.4,35.8,70.9,42.4,79.4,42.4z" fill="currentColor" />
</svg>
        </template>
        <template v-else>
          <i :class="key|toFontAwesome" />
        </template>
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
