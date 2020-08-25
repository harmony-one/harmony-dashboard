<template>
  <router-link :to="'/address/' + bech32">
    <span v-if="isHrc20">
      <span v-if="hrc20Info.logo">
        <img :src="hrc20Info.logo" class="hrclogo" @error="onError" />
      </span>
      <span v-if="!hrc20Info.logo">
        <span class="avatar" :style="bgStyle()">{{ hrc20Info.name[0] }}</span>
      </span>
      {{ hrc20Info.name }}
      <span v-if="showRaw"> ({{ bech32 || '—' }})</span>
    </span>

    <span v-else-if="showRaw">
      {{ bech32 || '—' }}
    </span>
    <span v-else>
      {{ bech32 || '—' | shorten }}
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'Address',
  props: ['bech32', 'showRaw'],
  data() {
    return {}
  },
  computed: {
    isHrc20() {
      return this.hrc20Info != undefined
    },
    hrc20Info() {
      return this.$store.data.Hrc20Address[this.bech32]
    },
  },
  methods: {
    onError() {
      this.hrc20Info.logo = null
    },
    bgStyle() {
      if (!this.hrc20Info.name) {
        return {}
      }
      const palette = [
        '#00ffff',
        '#24dbff',
        '#49b6ff',
        '#6d92ff',
        '#926dff',
        '#b649ff',
        '#db24ff',
        '#ff00ff',
      ]
      const c = this.hrc20Info.name.charCodeAt(0) % palette.length
      const backgroundColor = palette[c]
      return { backgroundColor: backgroundColor }
    },
  },
}
</script>

<style scoped>
.hrclogo {
  vertical-align: text-bottom;
  border-radius: 0.25rem;
  width: 1em;
  border: 1px solid var(--bc-dim);
}

.avatar {
  border-radius: 100%;
  display: table-cell;
  background-color: #47e0cd;
  color: white;
  height: 16px;
  width: 16px;
  font-weight: bold;
  text-transform: capitalize;
  text-align: center;
  vertical-align: middle;
  font-size: 10px;
  padding: 0;
  margin: 0;
}
</style>
