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
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Owner</th>
            <th style="max-width:300px">Description</th>
          </tr>
          <tr v-for="tx in txs" :key="tx.hash">
            <td>
              <img :src="tx.image" style="width:50px;"/>
            </td>

            <td>
              <router-link :to="'/tx/' + tx.hash">
                {{ tx.tokenId |  shorten  }}
              </router-link>
            </td>

            <td>
              <div>
                {{tx.name}}
              </div>
            </td>
            <td>
              <Address :bech32="tx.owner" />
            </td>
            <td style="max-width:300px" >
              {{ tx.description }}
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
  name: 'HRC721AssetsTable',
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
