<style scoped lang="less">
@import "../less/common.less";

.transaction-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.transaction-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;

  .transaction-table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    margin-bottom: 3em;
    td.td-title {
      font-weight: bold;
    }
    td {
      padding: @space-sm;
    }
  }
}
</style>

<template>
  <div class="transaction-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/"></router-link>
        </div>
      </div>
    </header>

    <div class="transaction-body">
      <div class="container" v-if="transaction">
        <h1>Transaction</h1>
        <div>
          <b>Transaction Hash</b>
          {{ transaction.hash }}
        </div>

        <h2>Summary</h2>
        <table class="transaction-table">
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
            <td class="td-title">Coinbase</td>
            <td>{{ transaction.coinbase }}</td>
          </tr>
        </table>
      </div>
    </div>
    <site-footer></site-footer>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";
import SiteFooter from "./SiteFooter";

export default {
  name: "TransactionPage",
  data() {
    return {
      transaction: null
    };
  },
  components: {
    FontAwesomeIcon,
    SiteFooter
  },
  mounted() {
    service
      .getTransaction(this.$route.params.transactionId)
      .then(transaction => (this.transaction = transaction));
  }
};
</script>