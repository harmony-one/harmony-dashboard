<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div class="container" v-if="!loading && address">
        <div class="explorer-card">
          <header>
            <h1>Address</h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">id</td>
                  <td>{{ address.id }}</td>
                </tr>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ address.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ txCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
        <div
          class="explorer-card"
          v-for="(shard, index) in address.shardData"
          :key="index"
        >
          <header>
            <h1>Shard {{ index }}</h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <div v-if="shard.err" class="text-error">{{ shard.err }}</div>
              <table class="explorer-table" v-else>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ shard.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ shard.txCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <transactions-table :allTxs="allTxs" with-shards="true" />
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

export default {
  name: 'AddressPage',
  data() {
    return {
      loading: true,
      address: null,
      allTxs: []
    };
  },
  components: {
    LoadingMessage,
    TransactionsTable
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    }
  },
  watch: {
    $route() {
      this.getAddress();
    }
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    getAddress() {
      this.loading = true;
      let txs = {};
      service
        .getAddress(this.$route.params.address)
        .then(address => {
          address.shardData.forEach(data => {
            data.txs.forEach(tx => {
              txs[tx.hash] = tx;
            });
          });

          this.address = address;
        })
        .finally(() => {
          this.allTxs = Object.values(txs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );
          this.loading = false;
        });
    }
  }
};
</script>
