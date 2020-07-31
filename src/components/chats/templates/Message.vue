<template>
  <div>
    <div
      class="message"
      v-for="(message,index) in messages"
      v-bind:key="index"
      :class="{own: message.email == email}"
    >
      <div
        class="username"
        v-if="index>0 && messages[index-1].email != message.email"
      >{{message.email}}</div>
      <div class="username" v-if="index == 0">{{message.email}}</div>
      <div style="margin-top: 5px"></div>
      <div class="content">
        <div v-html="message.content"></div>
        <div class="message-date">{{message.date}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["messages"],
  components: {},
  computed: {
    email() {
      return this.$store.getters.user.email;
    },
  },
  methods: {},
};
</script>

<style>
span.emoji {
  font-size: 20px;
  vertical-align: middle;
  line-height: 2;
}
</style>
