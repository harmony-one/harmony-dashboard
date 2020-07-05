<template>
  <div>
    <div v-if="methodInfo.abiItem && methodInfo.abiItem.name == 'transfer'">
      transfer
      <b :title="methodInfo.params[1]">{{ (methodInfo.params[1]/(10**contractInfo.decimals)).toFixed(4) }}</b>
      to
      <router-link :to="'/address/' + methodInfo.params[0]">
        {{ methodInfo.params[0] }}
      </router-link>
    </div>
    <div v-else>
      {{ methodInfo.toString() }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecodeABI',
  props: ['abi', 'data', 'bech32'],
  data() {
    return {};
  },
  computed: {
    contractInfo() {
      return this.$store.data.Hrc20Address[this.bech32];
    },
    methodInfo() {
      let c = this.$store.data.hmy.contract(this.abi);
      return c.decodeInput(this.data);
    },
  },
};
</script>
