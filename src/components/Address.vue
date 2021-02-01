<template>
  <span>
<!--    <span
      v-if="(!hrc721Info || !isHrc20 || showRaw) && bech32"
      class="address-type-control"
      @click="toggleView()"
    >
      &#8597;&nbsp;
    </span>-->
    <router-link
      :to="'/address/' + bech32 + (staking ? '?txType=staking' : '')"
    >
      <span v-if="isHrc20 && !addressOnly" style="line-height: 11px">
        <span :style="bgStyle(hrc20Info.name)">
          <b>{{ hrc20Info.symbol }}</b>
        </span>
        <span v-if="showRaw"> ({{ displayAddress || '—' }})</span>
      </span>

      <span v-if="isHrc721 && !addressOnly" style="line-height: 11px">
        <span :style="bgStyle(hrc721Info.name)">
          <b>{{ hrc721Info.symbol }}</b>
        </span>
        <span v-if="showRaw"> ({{ displayAddress || '—' }})</span>
      </span>

      <span v-else-if="showRaw">
        {{ displayAddress || '—' }}
      </span>
      <span v-else>
        {{ displayAddress || '—' | shorten }}
      </span>
    </router-link>
    <span
      v-if="showRaw"
      class="address-type-control"
      style="font-size:1em"
      @click="copy()"
      >&#x2398;</span
    >
  </span>
</template>

<script>
import copy from 'copy-text-to-clipboard'

export default {
  name: 'Address',
  props: ['bech32', 'showRaw', 'staking', 'addressOnly'],
  data() {
    return {
      showHex: false,
    }
  },
  watch: {
    displayFormat() {
      //this.displayAddress()
    }
  },
  computed: {
    hex() {
      return this.$store.data.hmy.hmySDK.crypto.fromBech32(this.bech32)
    },
    displayFormat() {
      return this.$store.data.displayAddressETH
    },
    displayAddress() {
      return this.displayFormat ? this.hex : this.bech32
    },
    isHrc20() {
      return this.hrc20Info !== undefined
    },
    isHrc721() {
      return !!this.hrc721Info
    },
    hrc20Info() {
      return this.$store.data.Hrc20Address[this.bech32]
    },
    hrc721Info() {
      return this.$store.data.hrc721.find(
        e => e.contractAddress === this.bech32
      )
    },
  },
  methods: {
    copy() {
      copy(this.displayAddress)
      this.$notify({
        group: '',
        title: 'Copied to clipboard',
        position: 'top left',
      })
    },
    toggleView() {
      this.showHex = !this.showHex
    },
    onError() {
      this.hrc20Info.logo = null
    },
    bgStyle(name) {
      if (!name) {
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
      const c = name.charCodeAt(0) % palette.length
      const backgroundColor = palette[c]
      return { color: backgroundColor }
    },
  },
}
</script>

<style scoped>
.hrclogo {
  vertical-align: middle;
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

.address-type-control {
  color: #999;
  font-size: 0.8em;
  cursor: pointer;
  user-select: none;
}
</style>
