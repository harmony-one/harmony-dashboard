<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div class="container" v-if="!loading">
        <div class="explorer-card">
          <header>
            <h1>Block</h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">Number</td>
                  <td>
                    <router-link :to="'/block/' + block.id">{{
                      block.height
                    }}</router-link>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ block.txCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>

          <header>
            <h1 class="flex-grow">Transactions</h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <div class="explorer-table-responsive latest-tx-table">
                <div class="tr">
                  <div class="th">Shard</div>
                  <div class="th">Hash</div>
                  <div class="th">From</div>
                  <div class="th">To</div>
                  <div class="th">Age</div>
                  <div class="th">Value</div>
                  <div class="th text-right">Txn Fee</div>
                </div>
                <div class="tr" v-for="tx in txs" :key="tx.id">
                  <div class="td">
                    <router-link :to="'/shard/' + tx.shardID">{{
                      tx.shardID
                    }}</router-link>
                  </div>
                  <div class="td">
                    <router-link :to="'/tx/' + tx.hash">{{
                      tx.hash | shorten
                    }}</router-link>
                  </div>
                  <div class="td">
                    <router-link :to="'/address/' + tx.from">{{
                      tx.from | shorten
                    }}</router-link>
                  </div>
                  <div class="td">
                    <router-link :to="'/address/' + tx.to">{{
                      tx.to | shorten
                    }}</router-link>
                  </div>
                  <div class="td">
                    {{ (Number(tx.timestamp) * 1000) | age }}
                  </div>
                  <div class="td">{{ tx.value | amount }}</div>
                  <div class="td text-right">{{ tx | fee }}</div>
                </div>
              </div>
            </section>
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
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "TransactionsByBlockPage",
  data() {
    return {
      loading: true,
      block: null,
      txs: []
    };
  },
  components: {
    LoadingMessage
  },
  watch: {
    $route() {
      this.getBlock();
    }
  },
  mounted() {
    this.getBlock();
  },
  methods: {
    getBlock() {
      this.loading = true;
      service
        .getBlock(this.$route.params.blockId)
        .then(block => {
          this.block = block;
          Promise.all(block.txs.map(tx => service.getTransaction(tx))).then(
            transactions => {
              this.txs = transactions;
              this.txs.sort((a, b) => Number(a.timestamp) > Number(b.timestamp) ? -1 : 1);
            }
          );
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>
