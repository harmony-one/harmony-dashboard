<style scoped lang="less">
@import "../less/common.less";
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
                <td>{{ transaction.hash }}</td>
              </tr>
              <tr>
                <td class="td-title">Value</td>
                <td>{{ transaction.value | amount }}</td>
              </tr>
              <!-- <tr>
                <td class="td-title">Size (bytes)</td>
                <td>{{ transaction.bytes }}</td>
              </tr>-->
              <!-- <tr>
                <td class="td-title">Received Time</td>
                <td>{{ transaction.receivedTime }}</td>
              </tr>-->
              <tr>
                <td class="td-title">Timestamp</td>
                <td>{{ transaction.timestamp | timestamp }}</td>
              </tr>
              <tr>
                <td
                  class="td-title"
                >{{ transaction.shardID === transaction.toShardID ? "Shard ID" : "From Shard" }}</td>
                <td>{{ transaction.shardID }}</td>
              </tr>
              <tr>
                <td class="td-title">From Shard Block</td>
                <td>
                  <router-link :to="'/block/' + transaction.blockHash">{{ transaction.blockHash }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">From Address</td>
                <td>
                  <router-link
                    :to="'/address/' + transaction.from"
                    v-if="transaction.from"
                  >{{ transaction.from }}</router-link>
                </td>
              </tr>
              <tr v-if="transaction.shardID !== transaction.toShardID">
                <td class="td-title">To Shard</td>
                <td>{{ transaction.toShardID }}</td>
              </tr>
              <tr v-if="receipt">
                <td class="td-title">To Shard Block</td>
                <td>
                  <router-link :to="'/block/' + receipt.blockHash">{{ receipt.blockHash }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">To Address</td>
                <td>
                  <router-link
                    :to="'/address/' + transaction.to"
                    v-if="transaction.to"
                  >{{ transaction.to }}</router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">Gas</td>
                <td>{{ normalizedGas() | amount }}</td>
              </tr>
              <tr>
                <td class="td-title">Data (Hex)</td>
                <td>{{ transaction.input || '-' }}</td>
              </tr>
              <tr v-if="sequence">
                <td class="td-title">Sequence</td>
                <td>{{ sequence }}</td>
              </tr>
              <tr>
                <td class="td-title">Data (UTF-8)</td>
                <td>{{ hexToUTF8(transaction.input) || '-' }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <loading-message />
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
      receipt: null,
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
  computed: {
    isCrossShard() {
      return (
        this.transaction &&
        this.transaction.shardID === this.transaction.toShardID
      );
    }
  },
  methods: {
    getSequence() {
      const data = this.transaction.input;
      const re = /.+?7c7c((30|31|32|33|34|35|36|37|38|39|4c|52|55|44)+)7c7c0*$/;
      const match = data.match(re);
      if (match && match[1] && match[1].length % 2 == 0) {
        this.sequence = this.hexToAscii(match[1]);
      }
    },
    getTransaction() {
      this.loading = true;
      service
        .getTransaction(this.$route.params.transactionId)
        .then(transaction => {
          this.transaction = transaction;
          if (this.transaction.shardID !== this.transaction.toShardID) {
            service
              .getCxReceipt(this.$route.params.transactionId)
              .then(receipt => {
                this.receipt = receipt;
                console.log("receipt", receipt);
              });
          }
          this.getSequence();
        })
        .finally(() => (this.loading = false));
    },
    hexToUTF8(h) {
      try {
        let s = hexToAscii(h);
        return decodeURIComponent(escape(s));
      } catch (e) {
        return "[Unknown Binary Content]";
      }
    },
    hexToAscii(h) {
      var s = "";
      for (var i = 0; i < h.length; i += 2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
      }
      return s;
    },
    normalizedGas() {
      return this.transaction.gas
        ? 0
        : Number(this.transaction.gas).toFixed(14);
    }
  }
};
</script>
