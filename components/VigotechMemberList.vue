<template>
  <div class="vigotech-member-list row">
    <vigotech-member
      v-for="(member, key) in members"
      :member="member"
      :key="key"
      :next-event="member.nextEvent"
      show-next-event
      class="col-xs-6 col-sm-4 col-md-3"
    />
  </div>
</template>

<script>
import VigotechMember from "./VigotechMember";
export default {
  name: 'VigotechMemberList',
  components: {
    VigotechMember
  },
  props: {
    members: {
      type: [Array, Object],
      required: true
    }
  },
}
</script>
