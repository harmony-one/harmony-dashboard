<style scoped lang="less">
@import "../less/common.less";

.transaction-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;
}
</style>

<template>
  <div class="transaction-page explorer-page page">
    <div class="transaction-body">
      <div class="container" v-if="transaction">
        <h1>Transaction</h1>
        <div class="hash">
          <b>Transaction Hash</b>
          {{ transaction.hash }}
        </div>

        <h2>Summary</h2>
        <table class="explorer-table">
          <tr>
            <td class="td-title">Size</td>
            <td>{{ transaction.bytes }} (bytes)</td>
          </tr>
          <tr>
            <td class="td-title">Received Time</td>
            <td>{{ transaction.receivedTime }}</td>
          </tr>
          <tr>
            <td class="td-title">Mined Time</td>
            <td>{{ transaction.minedTime }}</td>
          </tr>
          <tr>
            <td class="td-title">Included In Block</td>
            <td>
              <router-link :to="'/block/' + transaction.block">{{ transaction.block }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="td-title">From</td>
            <td>
              <router-link :to="'/address/' + transaction.from">{{ transaction.from }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="td-title">To</td>
            <td>
              <router-link :to="'/address/' + transaction.to">{{ transaction.to }}</router-link>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";

export default {
  name: "TransactionPage",
  data() {
    return {
      transaction: null
    };
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {
    service
      .getTransaction(this.$route.params.transactionId)
      .then(transaction => (this.transaction = transaction));
  }
};
</script>