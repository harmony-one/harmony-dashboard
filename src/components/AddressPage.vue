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
    <div class="address-body explorer-body">
      <div class="container" v-if="address">
        <div class="explorer-card">
          <header>
            <h1>Address</h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">Hash</td>
                  <td>{{ address.hash }}</td>
                </tr>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ address.balance }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ address.txCount }}</td>
                </tr>
              </table>
            </section>

            <section>
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
                    <router-link
                      tag="span"
                      class="disabled"
                      :to="'/address/' + tx.from"
                    >{{ tx.from | shorten }}</router-link>
                  </td>
                  <td>
                    <router-link
                      tag="span"
                      class="disabled"
                      :to="'/address/' + tx.to"
                    >{{ tx.to | shorten }}</router-link>
                  </td>
                  <td>{{ tx.value }}</td>
                </tr>
              </table>
            </section>
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
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "AddressPage",
  data() {
    return {
      address: null
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  mounted() {
    service
      .getAddress(this.$route.params.address)
      .then(address => (this.address = address));
  }
};
</script>