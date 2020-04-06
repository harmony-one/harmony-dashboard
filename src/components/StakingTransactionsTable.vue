<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="transactions-table explorer-card">
    <header>
      <h1 class="flex-grow">
        Staking transactions
      </h1>
      <div class="pagination-controls">
        <span class="total-tx-num">{{ txCount }} txs</span>
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
            <span class="pagination-nums">
              {{ pageIndex + 1 }} / {{ pageCount }}
            </span>
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
      <section>
        <table class="explorer-table">
          <tr>
            <th>
              Shard
            </th>
            <th>TxHash</th>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Validator</th>
            <th>Delegator</th>
            <th>Value</th>
            <th>Txn Fee</th>
          </tr>
          <tr v-for="tx in txs" :key="tx.hash">
            <td>
              {{ tx.shardID }}
            </td>
            <td>
              <router-link :to="'/staking-tx/' + tx.hash">
                {{ tx.hash | shorten }}
              </router-link>
            </td>
            <td>{{ (Number(tx.timestamp) * 1000) | timestamp }}</td>
            <td>
              {{ tx.type }}
            </td>
            <td>
              <router-link :to="'/address/' + tx.validator" v-if="tx.validator">
                {{ tx.validator | shorten }}
              </router-link>
              <div v-else>-</div>
            </td>
            <td>
              <router-link :to="'/address/' + tx.from" v-if="tx.delegator">
                {{ tx.delegator | shorten }}
              </router-link>
              <div v-else>-</div>
            </td>
            <td class="no-break">
              {{ tx.value | amount }}
            </td>
            <td class="no-break">
              {{ tx | fee }}
            </td>
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
      pageSize: 20,
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
    },
  },
  watch: {
    allTxs() {
      this.pageIndex = 0;
    },
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
    },
  },
};
</script>
