<style scoped lang="less">
@import '../less/common.less';
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

          <transactions-table :allTxs="block.txs" />
        </div>
      </div>
      <div class="container" v-else>
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import service from '../explorer/service';
import LoadingMessage from './LoadingMessage';
import TransactionsTable from './TransactionsTable';

const isObject = value => typeof value === 'object';

export default {
  name: 'TransactionsByBlockPage',
  data() {
    return {
      loading: true,
      block: null
    };
  },
  components: {
    TransactionsTable,
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

          this.block.txs = this.block.txs
            .map(tx => ({
              ...tx,
              from: isObject(tx.from) ? tx.from.bech32 : tx.from,
              to: isObject(tx.to) ? tx.to.bech32 : tx.to,
              hash: tx.id,
              timestamp: tx.timestamp / 1000
            }))
            .sort((a, b) =>
              Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
            );
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>
