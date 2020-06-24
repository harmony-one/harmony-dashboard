<template>
  <router-link :to="'/address/' + bech32">
    <span v-if="isHrc20">
      <img :src="hrc20Info.logo" class="hrclogo" />
      {{ hrc20Info.name }}
      <span v-if="showRaw"> ({{ bech32 || '-' }})</span>
    </span>
    <span v-else-if="showRaw">
      {{ bech32 || '-' }}
    </span>
    <span v-else>
      {{ bech32 || '-' | shorten }}
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'Address',
  props: ['bech32', 'showRaw'],
  data() {
    console.log('showRaw:', this.showRaw);
    return {};
  },
  computed: {
    isHrc20() {
      return this.hrc20Info != undefined;
    },
    hrc20Info() {
      return this.$store.data.Hrc20Address[this.bech32];
    },
  },
};
</script>

<style scoped>
.hrclogo {
  vertical-align: text-bottom;
  border-radius: 0.25rem;
  width: 1em;
  border: 1px solid var(--bc-dim);
}
</style>
