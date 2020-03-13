<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="txs-page explorer-page page">
    <div class="txs-body explorer-body">
      <div class="container">
        <div class="explorer-card">
          <header>
            <h1 class="flex-grow">
              Transactions
            </h1>
            <div class="pagination-controls">
              <span class="total-tx-num">{{ globalData.txCount }} txs</span>
              <span class="page-controllers">
                <span class="page-navigator">
                  <button
                    class="btn btn-light btn-icon-only"
                    :disabled="pageIndex === 0"
                    @click="first()"
                  >
                    <font-awesome-icon icon="angle-double-left" />
                  </button>
                  <button
                    class="btn btn-light btn-icon-only"
                    :disabled="pageIndex === 0"
                    @click="prev()"
                  >
                    <font-awesome-icon icon="chevron-left" />
                  </button>
                  <span class="pagination-nums"
                    >{{ pageIndex + 1 }} / {{ pageCount }}</span
                  >
                  <button
                    class="btn btn-light btn-icon-only"
                    :disabled="pageIndex === pageCount - 1"
                    @click="next()"
                  >
                    <font-awesome-icon icon="chevron-right" />
                  </button>
                  <button
                    class="btn btn-light btn-icon-only"
                    :disabled="pageIndex === pageCount - 1"
                    @click="last()"
                  >
                    <font-awesome-icon icon="angle-double-right" />
                  </button>
                </span>
              </span>
            </div>
          </header>
          <div class="explorer-card-body">
            <table
v-if="txs.length" class="explorer-table"
>
              <tr>
                <th>Shard</th>
                <th>Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Age</th>
                <th class="text-right">
                  Value
                </th>
                <th class="text-right">
                  Txn Fee
                </th>
                <th class="text-right">
                  Size (bytes)
                </th>
              </tr>
              <tr
v-for="tx in txs" class="container"
:key="tx.id"
>
                <td>
                  <!-- <router-link :to="'/shard/' + tx.shardID"> -->
                  {{ tx.shardID }}
                  <!-- </router-link> -->
                </td>
                <td>
                  <router-link :to="'/tx/' + tx.id">
                    {{ tx.id | shorten }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    v-if="tx.from.bech32"
                    :to="'/address/' + tx.from.bech32"
                  >
                    {{ tx.from.bech32 | shorten }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    v-if="tx.to.bech32"
                    :to="'/address/' + tx.to.bech32"
                  >
                    {{ tx.to.bech32 | shorten }}
                  </router-link>
                </td>
                <td>{{ tx.timestamp | age }}</td>
                <td class="text-right no-break">
                  {{ tx.value | amount }}
                </td>
                <td class="text-right no-break">
                  {{ tx | fee }}
                </td>
                <td class="text-right">
                  {{ tx.bytes }}
                </td>
              </tr>
            </table>

            <div v-else>
              <loading-message />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../explorer/store';
import service from '../explorer/service';
import LoadingMessage from './LoadingMessage';

export default {
  name: 'TransactionsPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      globalData: store.data,
      txs: [],
      pageIndex: 0,
      pageSize: 50,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.globalData.txCount / this.pageSize);
    },
  },
  watch: {
    $route(to) {
      this.pageIndex = (+to.params.pageIndex || 1) - 1;
      this.getTransactions();
    },
  },
  mounted() {
    if (this.$route.params.pageIndex) {
      this.pageIndex = +this.$route.params.pageIndex - 1;
    }
    this.getTransactions();
  },
  methods: {
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;
      this.$router.replace({
        name: 'TransactionsPage',
        params: { pageIndex: index + 1 },
      });
    },
    first() {
      this.goToPage(0);
    },
    last() {
      this.goToPage(this.pageCount - 1);
    },
    prev() {
      if (this.pageIndex === 0) return;
      this.goToPage(this.pageIndex - 1);
    },
    next() {
      if (this.pageIndex === this.pageCount - 1) return;
      this.goToPage(this.pageIndex + 1);
    },
    getTransactions() {
      this.txs = [];
      service.getTransactions(this.pageIndex, this.pageSize).then(txs => {
        this.txs = txs;
      });
    },
  },
};
</script>
