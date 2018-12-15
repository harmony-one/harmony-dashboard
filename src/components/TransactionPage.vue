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
    <div class="transaction-body explorer-body">
      <div class="container" v-if="transaction">
        <div class="explorer-card">
          <header>
            <h1>Transaction</h1>
          </header>
          <div class="explorer-card-body">
            <table class="explorer-table">
              <tr>
                <td class="td-title">ID</td>
                <td>{{ transaction.id }}</td>
              </tr>
              <tr>
                <td class="td-title">Size (bytes)</td>
                <td>{{ transaction.bytes }}</td>
              </tr>
              <!-- <tr>
                <td class="td-title">Received Time</td>
                <td>{{ transaction.receivedTime }}</td>
              </tr>-->
              <tr>
                <td class="td-title">Timestamp</td>
                <td>{{ transaction.timestamp | timestamp }}</td>
              </tr>
              <tr>
                <td class="td-title">Included In Block</td>
                <td>
                  <router-link :to="'/block/' + transaction.blockID">{{ transaction.blockID }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">From</td>
                <td>
                  <router-link
                    tag="span"
                    class="disabled"
                    :to="'/address/' + transaction.from"
                  >{{ transaction.from }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">To</td>
                <td>
                  <router-link
                    tag="span"
                    class="disabled"
                    :to="'/address/' + transaction.to"
                  >{{ transaction.to }}</router-link>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <loading-message/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../explorer/store";
import service from "../service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "TransactionPage",
  data() {
    return {
      transaction: null
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  mounted() {
    service
      .getTransaction(this.$route.params.transactionId)
      .then(transaction => (this.transaction = transaction));
  }
};
</script>