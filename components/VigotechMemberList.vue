<template>
  <div class="vigotech-member-list row">
    <div
      v-for="(member, key) in members"
      :key="key"
      class="col-xs-6 col-sm-4 col-md-3"
    >
      <vigotech-member
        :member="member"
        :next-event="member.nextEvent"
        show-next-event
        class="box"
      />
    </div>
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
