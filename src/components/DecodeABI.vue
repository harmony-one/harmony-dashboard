<template>
  <div>
    <div v-if="methodInfo.abiItem && methodInfo.abiItem.name == 'transfer'">
      transfer
      <b :title="methodInfo.params[1]">{{
        (methodInfo.params[1] / 10 ** contractInfo.decimals).toLocaleString('en-US')
      }}</b>
      to
      <router-link :to="'/address/' + methodInfo.params[0]">
        {{ methodInfo.params[0] }}
      </router-link>
    </div>
    <div v-else>
      {{ methodInfo ? methodInfo.toString() : '—' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecodeABI',
  props: ['abi', 'data', 'bech32'],
  data() {
    return {}
  },
  computed: {
    contractInfo() {
      const res =  this.$store.data.Hrc20Address[this.bech32]
      return res
    },
    methodInfo() {
      let c = this.$store.data.hmy.contract(this.abi)
      const res = c.decodeInput(this.data)
      return res
    },
  },
}
</script>
