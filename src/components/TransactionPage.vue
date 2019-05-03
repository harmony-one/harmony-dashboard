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
      <div class="container" v-if="!loading && transaction">
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
                <td class="td-title">Value</td>
                <td>{{ Number(transaction.value)/1000000000000000000 }}</td>
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
                <td class="td-title">Included In Shard</td>
                <td>{{ transaction.shardID }}</td>
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
                  <router-link :to="'/address/' + transaction.from">{{ transaction.from }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">To</td>
                <td>
                  <router-link :to="'/address/' + transaction.to">{{ transaction.to }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">Data (Hex)</td>
                <td>{{ transaction.data || '-' }}</td>
              </tr>
              <tr v-if="sequence">
                <td class="td-title">Sequence</td>
                <td>{{ sequence }}</td>
              </tr>
              <tr>
                <td class="td-title">Data (UTF-8)</td>
                <td>{{ hexToUTF8(transaction.data) || '-' }}</td>
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
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "TransactionPage",
  data() {
    return {
      loading: true,
      transaction: null,
      sequence: null
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  watch: {
    $route(to, from) {
      this.getTransaction();
    }
  },
  mounted() {
    this.getTransaction();
  },
  methods: {
    getSequence() {
      const data = this.transaction.data;
      const re = /.*?((4c|52|55|44)+)0*$/;
      const match = data.match(re);
      if (match && match[1] && match[1].length % 2 == 0) {
        let moves = match[1];
        let res = "";
        for (i = 0; i < moves.length; i += 2) {
          if (moves[i] == "4" && moves[i + 1] == "c") res = res + "L";
          else if (moves[i] == "5" && moves[i + 1] == "2") res = res + "R";
          else if (moves[i] == "5" && moves[i + 1] == "5") res = res + "U";
          else if (moves[i] == "4" && moves[i + 1] == "4") res = res + "D";
          else {
            this.sequence = null;
            return;
          }
        }
        this.sequence = res;
      }
    },
    getTransaction() {
      this.loading = true;
      service
        .getTransaction(this.$route.params.transactionId)
        .then(transaction => {
          this.transaction = transaction;
          this.getSequence();
        })
        .finally(() => (this.loading = false));
    },
    hexToUTF8(h) {
      try {
        var s = "";
        for (var i = 0; i < h.length; i += 2) {
          s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
        }
        return decodeURIComponent(escape(s));
      } catch (e) {
        return "[Unknown Binary Content]";
      }
    }
  }
};
</script>
