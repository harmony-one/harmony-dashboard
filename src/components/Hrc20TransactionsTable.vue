<style scoped lang="less">
@import '../less/common.less';

.wfont {
  font-family: monospace, 'Courier New', Courier;
  font-size: 16px;
}
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
              {{ pageIndex + 1 }} / {{ pageCount ? pageCount : 1 }}
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
            <th>Shard</th>
            <th>TxHash</th>
            <th>From</th>
            <th>To</th>
            <th>Age</th>
            <th>Token</th>
            <th>Token Amount</th>
          </tr>
          <tr v-for="tx in Hrc20TxsPage" :key="tx.tx.hash">
            <td>
              <router-link :to="'/shard/' + tx.tx.shardID">
                {{ tx.tx.shardID }}
              </router-link>
            </td>
            <td>
              <router-link :to="'/tx/' + tx.tx.hash">
                {{ tx.tx.hash | shorten }}
              </router-link>
            </td>
            <td>
              <router-link :to="'/address/' + tx.tx.from">
                {{ tx.hrc20tx.from | shorten }}
              </router-link>
            </td>
            <td>
              <router-link :to="'/address/' + tx.hrc20tx.to">
                {{ tx.hrc20tx.to | shorten }}
              </router-link>
            </td>
            <td>
              {{ (Number(tx.tx.timestamp) * 1000) | age }}
            </td>
            <td>
              <Address :bech32="tx.tx.to" />
            </td>
            <td class="no-break wfont">
              {{ hrc20Balance(tx.tx.to, tx.hrc20tx.amount) }}
            </td>
          </tr>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import Address from './Address'
import { displayAmount } from '@/utils/displayAmount'

export default {
  name: 'Hrc20TransactionsTable',
  components: { Address },
  props: [
    'allTxs',
    'txCount',
    'withShards',
    'page',
    'changePage',
    'isLocal',
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
    Hrc20TxsPage() {
      //const start = this.pageSize * this.pageIndex;
      //return this.Hrc20Txs.slice(start, start + this.pageSize);
      return this.Hrc20Txs
    },
    Hrc20Txs() {
      const c = this.$store.data.hmy.contract(this.$store.data.HRC20_ABI)
      return this.txs.reduce((list, tx) => {
        if (this.hrc20info(tx.to) == undefined) {
          return list
        }
        const decodeObj = c.decodeInput(tx.input)
        if (decodeObj.abiItem && decodeObj.abiItem.name == 'transfer')
          list.push({
            tx,
            hrc20tx: {
              from: tx.from,
              to: decodeObj.params[0],
              amount: decodeObj.params[1],
            },
          })
        else if (decodeObj.abiItem && decodeObj.abiItem.name == 'transferFrom')
          list.push({
            tx,
            hrc20tx: {
              from: decodeObj.params[0],
              to: decodeObj.params[1],
              amount: decodeObj.params[2],
            },
          })
        return list
      }, [])
    },
    Hrc20Address() {
      return this.$store.data.Hrc20Address
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

      const lastTxs = this.Hrc20Txs.slice(-1)[0].tx
      const sortid =
        this.pageIndex + 1 == index
          ? Number(lastTxs.blockNumber) * 10000 +
            Number(lastTxs.transactionIndex)
          : undefined
      this.pageIndex = index
      if (this.changePage) {
        this.changePage(index, sortid)
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
    hrc20info(id) {
      return this.Hrc20Address[id]
    },
    hrc20Balance(id, amount) {
      return (
        displayAmount(amount, this.hrc20info(id).decimals) +
        ' ' +
        this.hrc20info(id).symbol
      )
    },
  },
}
</script>
