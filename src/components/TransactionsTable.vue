<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="transactions-table explorer-card">
    <header>
      <h1 class="flex-grow">Transactions</h1>
      <div class="pagination-controls">
        <span class="total-tx-num">{{ txCount }} txs</span>
        <span class="page-controllers">
          <span class="page-navigator">
            <button
              class="btn btn-light btn-icon-only"
              @click="first()"
              :disabled="pageIndex === 0"
            >
              <font-awesome-icon icon="angle-double-left" />
            </button>
            <button
              class="btn btn-light btn-icon-only"
              @click="prev()"
              :disabled="pageIndex === 0"
            >
              <font-awesome-icon icon="chevron-left" />
            </button>
            <span class="pagination-nums"
              >{{ pageIndex + 1 }} / {{ pageCount }}</span
            >
            <button
              class="btn btn-light btn-icon-only"
              @click="next()"
              :disabled="pageIndex === pageCount - 1"
            >
              <font-awesome-icon icon="chevron-right" />
            </button>
            <button
              class="btn btn-light btn-icon-only"
              @click="last()"
              :disabled="pageIndex === pageCount - 1"
            >
              <font-awesome-icon icon="angle-double-right" />
            </button>
          </span>
        </span>
      </div>
    </header>
    <div class="explorer-card-body">
      <section>
        <table class="explorer-table">
          <tr>
            <th v-if="!withShards">Shard</th>
            <th>TxHash</th>
            <th>Timestamp</th>
            <th v-if="withShards">From ShardID</th>
            <th v-if="withShards">To ShardID</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
            <th>Txn Fee</th>
          </tr>
          <tr v-for="tx in txs" :key="tx.hash">
            <td v-if="!withShards">{{ tx.shardID }}</td>
            <td>
              <router-link :to="'/tx/' + tx.hash">{{
                tx.hash | shorten
              }}</router-link>
            </td>
            <td>{{ (Number(tx.timestamp) * 1000) | timestamp }}</td>
            <td v-if="withShards">{{ tx.shardID }}</td>
            <td v-if="withShards">{{ tx.toShardID }}</td>
            <td>
              <router-link :to="'/address/' + tx.from">{{
                tx.from | shorten
              }}</router-link>
            </td>
            <td>
              <router-link :to="'/address/' + tx.to">{{
                tx.to | shorten
              }}</router-link>
            </td>
            <td class="no-break">{{ tx.value | amount }}</td>
            <td class="no-break">{{ tx | fee }}</td>
          </tr>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionsTable',
  props: ['allTxs', 'withShards'],
  data() {
    return {
      loading: true,
      pageIndex: 0,
      pageSize: 20
    };
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    },
    pageCount() {
      return Math.ceil(this.txCount / this.pageSize);
    },
    txs() {
      const begin = this.pageIndex * this.pageSize;

      return this.allTxs.slice(begin, begin + this.pageSize);
    }
  },
  watch: {
    allTxs() {
      this.pageIndex = 0;
    }
  },
  methods: {
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;

      this.pageIndex = index;
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
    }
  }
};
</script>
