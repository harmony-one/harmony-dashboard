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
              Staking Transactions
            </h1>
            <div class="pagination-controls">
              <span
                class="total-tx-num"
              >{{ globalData.stakingTxCount }} txs</span>
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
            <div
              v-if="stakingTxs.length"
              class="explorer-table-responsive latest-tx-table"
            >
              <div class="tr">
                <div class="th">
                  Shard
                </div>
                <div class="th">
                  Hash
                </div>
                <div class="th">
                  Timestamp
                </div>
                <div class="th">
                  Type
                </div>
                <div class="th">
                  Validator
                </div>
                <div class="th">
                  Delegator
                </div>
                <div class="th">
                  Value
                </div>
                <div class="th text-right">
                  Txn Fee
                </div>
              </div>
              <div
                v-for="tx in stakingTxs"
                :key="tx.id"
                class="tr"
              >
                <div class="td">
                  <router-link :to="'/shard/' + tx.shardID">
                    {{ tx.shardID }}
                  </router-link>
                </div>
                <div class="td">
                  <router-link :to="'/staking-tx/' + tx.id">
                    {{ tx.id | shorten }}
                  </router-link>
                </div>
                <div class="td">
                  {{ tx.timestamp | timestamp }}
                </div>
                <div class="td">
                  {{ tx.type }}
                </div>
                <div class="td">
                  <router-link
                    v-if="tx.validator.bech32"
                    :to="'/address/' + tx.validator.bech32"
                  >
                    {{ tx.validator.bech32 | shorten }}
                  </router-link>
                  <div v-else>
                    -
                  </div>
                </div>
                <div class="td">
                  <router-link
                    v-if="tx.delegator.bech32"
                    :to="'/address/' + tx.delegator.bech32"
                  >
                    {{ tx.delegator.bech32 | shorten }}
                  </router-link>
                  <div v-else>
                    -
                  </div>
                </div>
                <div class="td no-break">
                  {{ tx.value | amount }}
                </div>
                <div class="td text-right no-break">
                  {{ tx | fee }}
                </div>
              </div>
            </div>

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
  name: 'StakingTransactionsPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      globalData: store.data,
      stakingTxs: [],
      pageIndex: 0,
      pageSize: 50,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.globalData.stakingTxCount / this.pageSize);
    },
  },
  watch: {
    $route(to) {
      this.pageIndex = (+to.params.pageIndex || 1) - 1;
      this.getStakingTransactions();
    },
  },
  mounted() {
    if (this.$route.params.pageIndex) {
      this.pageIndex = +this.$route.params.pageIndex - 1;
    }
    this.getStakingTransactions();
  },
  methods: {
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;
      this.$router.replace({
        name: 'StakingTransactionsPage',
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
    getStakingTransactions() {
      this.stakingTxs = [];
      service
        .getStakingTransactions(this.pageIndex, this.pageSize)
        .then(txs => {
          this.stakingTxs = txs;
        });
    },
  },
};
</script>
