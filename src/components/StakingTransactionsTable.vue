<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="transactions-table explorer-card">
    <header>
      <slot></slot>
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

    <div
      class="explorer-card-body"
      style="position: relative; min-height: 200px;"
      ref="loadingContainer"
    >
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
          <tr v-for="tx in stakingTxs" :key="tx.hash">
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
              <router-link
                v-if="tx.validator"
                :to="'/address/' + tx.validator + '?txType=staking'"
              >
                {{ tx.validator | shorten }}
              </router-link>
              <div v-else>
                -
              </div>
            </td>
            <td>
              <router-link
                v-if="tx.delegator"
                :to="'/address/' + tx.from + '?txType=staking'"
              >
                {{ tx.delegator | shorten }}
              </router-link>
              <div v-else>
                -
              </div>
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
  name: 'StakingTransactionsTable',
  props: [
    'allStakingTxs',
    'withShards',
    'page',
    'changePage',
    'isLocal',
    'txCount',
    'loading',
  ],
  data() {
    return {
      pageIndex: this.page || 0,
      pageSize: 20,
      loader: null,
    };
  },
  mounted() {
    this.setLoader();
  },
  watch: {
    loading() {
      this.setLoader();
    },
  },
  computed: {
    pageCount() {
      return Math.ceil(this.txCount / this.pageSize);
    },
    stakingTxs() {
      const begin = this.pageIndex * this.pageSize;

      if (!this.isLocal) {
        return this.allStakingTxs;
      } else {
        return this.allStakingTxs.slice(begin, begin + this.pageSize);
      }
    },
  },
  methods: {
    setLoader() {
      if (this.loading) {
        this.loader = this.$loading.show({
          container: this.$refs.loadingContainer,
          canCancel: false,
        });
      } else if (this.loader) {
        this.loader.hide();
      }
    },
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;

      this.pageIndex = index;

      if (this.changePage) {
        this.changePage(index);
      }
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
