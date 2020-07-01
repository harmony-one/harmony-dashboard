<template>
  <div>
    <div v-if="methodInfo.abiItem && methodInfo.abiItem.name == 'transfer'">
      transfer
      <b>{{ methodInfo.params[1] }}</b>
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
  props: ['abi', 'data', 'isHrc20'],
  data() {
    return {};
  },
  computed: {
    methodInfo() {
      let c = this.$store.data.hmy.contract(this.abi);
      let obj = c.decodeInput(this.data);
      return c.decodeInput(this.data);
    },
  },
};
</script>
