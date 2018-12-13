<style scoped lang="less">
@import "../less/common.less";

.address-body {
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
  <div class="address-page explorer-page page">
    <div class="address-body">
      <div class="container" v-if="address">
        <h1>Address</h1>
        <div class="hash">
          <b>address Hash</b>
          {{ address.hash }}
        </div>

        <h2>Summary</h2>
        <table class="explorer-table">
          <tr>
            <td class="td-title">Balance</td>
            <td>{{ address.balance }}</td>
          </tr>
          <tr>
            <td class="td-title">Transactions</td>
            <td>{{ address.txCount }}</td>
          </tr>
        </table>

        <h2>Transactions</h2>
        <table class="explorer-table">
          <tr>
            <th>TxHash</th>
            <th>Age</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
          </tr>
          <tr v-for="tx in address.txs" :key="tx.id">
            <td>
              <router-link :to="'/tx/' + tx.id">{{ tx.id | shorten }}</router-link>
            </td>
            <td>{{ tx.timestamp }}</td>
            <td>
              <router-link :to="'/address/' + tx.from">{{ tx.from | shorten }}</router-link>
            </td>
            <td>
              <router-link :to="'/address/' + tx.to">{{ tx.to | shorten }}</router-link>
            </td>
            <td>{{ tx.value }}</td>
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
  name: "AddressPage",
  data() {
    return {
      address: null
    };
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {
    service
      .getAddress(this.$route.params.address)
      .then(address => (this.address = address));
  }
};
</script>