<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="txs-page explorer-page page">
    <div class="txs-body explorer-body">
      <div class="container">
        <div class="explorer-card">
          <header style="align-items: center;">
            <h1 class="flex-grow">
              Transactions
            </h1>
            <div class="pagination-controls">
              <div class="page-controllers-row">
                <div>From:</div>
                <VueCtkDateTimePicker
                  v-model="cursor"
                  format="YYYY-MM-DD hh:mm"
                  color="#33cbda"
                  button-color="#33cbda"
                  :no-clear-button="true"
                  :max-date="maxDate"
                />
                <button
                  class="btn btn-light btn-icon-only"
                  style="width: 200px; margin-left: 40px;"
                  @click="next()"
                >
                  <span style="margin-right: 10px;">Prev 50 txs</span>
                  <font-awesome-icon icon="chevron-right" />
                </button>
              </div>
            </div>
          </header>
          <div class="explorer-card-body">
            <table v-if="txs.length" class="explorer-table">
              <tr>
                <th>Shard</th>
                <th>Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Type</th>
                <th>Age</th>
                <th class="text-right">
                  Value
                </th>
                <th class="text-right">
                  Txn Fee
                </th>
                <!-- <th class="text-right">
                  Size (bytes)
                </th>-->
              </tr>
              <tr v-for="tx in txs" :key="tx.id" class="container">
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
                <td>
                  {{ tx | txType }}
                </td>
                <td>
                  {{ tx.timestamp | age }}
                </td>
                <td class="text-right no-break">
                  {{ tx.value | amount }}
                </td>
                <td class="text-right no-break">
                  {{ tx | fee }}
                </td>
                <!--<td class="text-right">
                  {{ tx.bytes }}
                </td>-->
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
import store from '../explorer/store'
import service from '../explorer/service'
import LoadingMessage from './LoadingMessage'
import moment from 'moment'

export default {
  name: 'TransactionsPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      globalData: store.data,
      txs: [],
      cursor: moment(),
      maxDate: moment().toString(),
      pageSize: 50,
    }
  },
  watch: {
    $route() {
      let queryCursor = Number(this.$route.query.from)
      queryCursor = isNaN(queryCursor) ? undefined : queryCursor

      const cursor = moment(queryCursor)

      if (cursor.diff(this.cursor)) {
        this.cursor = cursor
        this.getTransactions()
      }
    },
    cursor() {
      const unixCursor = moment(this.cursor).unix() * 1000

      this.$router.replace({
        name: 'TransactionsPage',
        query: { from: unixCursor },
      })

      this.getTransactions()
    },
  },
  mounted() {
    let queryCursor = Number(this.$route.query.from)
    queryCursor = isNaN(queryCursor) ? undefined : queryCursor

    this.cursor = moment(queryCursor)

    this.getTransactions()
  },
  methods: {
    next() {
      this.cursor = moment(this.txs[this.txs.length - 1].timestamp)
    },
    getTransactions() {
      this.txs = []

      const cursor = moment(this.cursor).unix() * 1000

      service.getTransactions(cursor, this.pageSize).then(txs => {
        this.txs = txs
      })
    },
  },
}
</script>
