<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="transactions-table explorer-card">
    <header>
      <slot />
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
      ref="loadingContainer"
      class="explorer-card-body"
      style="position: relative; min-height: 200px;"
    >
      <section>
        <table class="explorer-table">
          <tr>
            <th v-if="!withShards">
              Shard
            </th>
            <th>TxHash</th>
            <th>Timestamp</th>
            <th v-if="withShards">
              From ShardID
            </th>
            <th v-if="withShards">
              To ShardID
            </th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
            <th>Txn Fee</th>
          </tr>
          <tr v-for="tx in txs" :key="tx.hash">
            <td v-if="!withShards">
              {{ tx.shardID }}
            </td>
            <td>
              <router-link :to="'/tx/' + tx.hash">
                {{ tx.hash | shorten }}
              </router-link>
            </td>
            <td>{{ (Number(tx.timestamp) * 1000) | timestamp }}</td>
            <td v-if="withShards">
              {{ tx.shardID }}
            </td>
            <td v-if="withShards">
              {{ tx.toShardID }}
            </td>
            <td>
              <router-link :to="'/address/' + tx.from">
                {{ tx.from | shorten }}
              </router-link>
            </td>
            <td>
              <Address :bech32="tx.to" />
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
import Address from './Address'
export default {
  name: 'TransactionsTable',
  components: { Address },
  props: [
    'allTxs',
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
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.txCount / this.pageSize)
    },
    txs() {
      const begin = this.pageIndex * this.pageSize

      if (!this.isLocal) {
        return this.allTxs
      } else {
        return this.allTxs.slice(begin, begin + this.pageSize)
      }
    },
  },
  watch: {
    loading() {
      this.setLoader()
    },
  },
  mounted() {
    this.setLoader()
  },
  methods: {
    setLoader() {
      if (this.loading) {
        this.loader = this.$loading.show({
          container: this.$refs.loadingContainer,
          canCancel: false,
        })
      } else if (this.loader) {
        this.loader.hide()
      }
    },
    goToPage(index) {
      if (index < 0) index = 0
      if (index >= this.pageCount) index = this.pageCount - 1

      this.pageIndex = index

      if (this.changePage) {
        this.changePage(index)
      }
    },
    first() {
      this.goToPage(0)
    },
    last() {
      this.goToPage(this.pageCount - 1)
    },
    prev() {
      if (this.pageIndex === 0) return
      this.goToPage(this.pageIndex - 1)
    },
    next() {
      if (this.pageIndex === this.pageCount - 1) return
      this.goToPage(this.pageIndex + 1)
    },
  },
}
</script>
