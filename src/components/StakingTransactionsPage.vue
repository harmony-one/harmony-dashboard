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
              Staking Transactions
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
              <div v-for="tx in stakingTxs" :key="tx.id" class="tr">
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
import store from '../explorer/store'
import service from '../explorer/service'
import LoadingMessage from './LoadingMessage'
import moment from 'moment'

export default {
  name: 'StakingTransactionsPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      globalData: store.data,
      stakingTxs: [],
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
        name: 'StakingTransactionsPage',
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
      this.cursor = moment(
        this.stakingTxs[this.stakingTxs.length - 1].timestamp
      )
    },
    getTransactions() {
      this.stakingTxs = []

      const cursor = moment(this.cursor).unix() * 1000

      service.getStakingTransactions(cursor, this.pageSize).then(txs => {
        this.stakingTxs = txs
      })
    },
  },
}
</script>
