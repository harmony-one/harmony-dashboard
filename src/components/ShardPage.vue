<style scoped lang="less">
@import '../less/common.less';

.page-title {
  font-size: 1.8em;
  margin: @space-sm;
  color: #1b295e;
  text-transform: uppercase;
  font-weight: 500;
}
.wfont {
  font-family: monospace, 'Courier New', Courier;
}
</style>

<template>
  <div class="shard-page explorer-page page">
    <div class="shard-body explorer-body">
      <div v-if="shard" class="container">
        <h1 class="page-title">Shard {{ $route.params.id }}</h1>
        <div class="explorer-card status-card">
          <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-block-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ shard.blockCount | number }}
                  </div>
                  <h1>Block Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-tx-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ shard.blockLatency | blockLatency }}
                  </div>
                  <h1>Block Latency</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-node-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ shard.nodeCount | number }}
                  </div>
                  <h1>Node Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-block-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ shard.txCount | number }}
                  </div>
                  <h1>Tx Count</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="explorer-card latest-block-card">
          <header>
            <h1 class="flex-grow">
              Latest Blocks
            </h1>
            <div class="secondary-info">
              <div class="timer">
                Updated
                {{
                  Math.round(Math.max((now - shard.lastUpdateTime) / 1000, 0))
                    | number
                }}s ago...
              </div>
              <span class="total-block-num" />
            </div>
          </header>
          <div class="explorer-card-body">
            <div class="explorer-table-responsive latest-block-table">
              <div class="tr">
                <div class="th">
                  Shard
                </div>
                <div class="th">
                  Hash
                </div>
                <div class="th">
                  Height
                </div>
                <div class="th text-right">
                  Timestamp
                </div>
                <div class="th text-right">
                  Age
                </div>
                <div v-if="showTx" class="th text-right">
                  Transactions
                </div>
              </div>
              <div v-for="block in shard.blocks" :key="block.id" class="tr">
                <div class="td">
                  <router-link :to="'/shard/' + block.shardID">
                    {{ block.shardID }}
                  </router-link>
                </div>
                <div class="td">
                  <router-link :to="'/block/' + block.id">
                    {{ block.id | shorten }}
                  </router-link>
                </div>
                <div class="td">
                  <router-link :to="'/block/' + block.id">
                    {{ block.height | number }}
                  </router-link>
                </div>
                <div class="td text-right">
                  {{ block.timestamp | timestamp }}
                </div>
                <div class="td text-right">
                  {{ block.timestamp | age }}
                </div>
                <div v-if="showTx" class="td text-right">
                  {{ block.txCount }}
                </div>
              </div>
            </div>
          </div>
          <!-- <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="blocks"
                >View all blocks</router-link>
          </footer>-->
        </div>
        <div class="explorer-card latest-block-card">
          <header>
            <h1 class="flex-grow">
              Latest Transactions
            </h1>
            <div class="secondary-info">
              <div class="timer">
                Updated
                {{
                  Math.round(Math.max((now - shard.lastUpdateTime) / 1000, 0))
                    | number
                }}s ago...
              </div>
              <span class="total-block-num" />
            </div>
          </header>
          <div class="explorer-card-body">
            <div class="explorer-table-responsive latest-tx-table">
              <div class="tr">
                <div class="th">
                  Shard
                </div>
                <div class="th">
                  Hash
                </div>
                <div class="th">
                  From
                </div>
                <div class="th">
                  To
                </div>
                <div class="th">
                  Age
                </div>
                <div class="th">
                  Value
                </div>
                <div class="th text-right">
                  Txn Fee
                </div>
              </div>
              <div v-for="tx in shard.txs" :key="tx.id" class="tr">
                <div class="td">
                  <router-link :to="'/shard/' + tx.shardID">
                    {{ tx.shardID }}
                  </router-link>
                </div>
                <div class="td">
                  <router-link :to="'/tx/' + tx.id">
                    {{ tx.id | shorten }}
                  </router-link>
                </div>
                <div class="td">
                  <router-link :to="'/address/' + tx.from.bech32">
                    {{ tx.from.bech32 | shorten }}
                  </router-link>
                </div>
                <div class="td">
                  <router-link :to="'/address/' + tx.to.bech32">
                    {{ tx.to.bech32 | shorten }}
                  </router-link>
                </div>
                <div class="td">
                  {{ tx.timestamp | age }}
                </div>
                <div class="td no-break">
                  {{ tx.value | amount }}
                </div>
                <div class="td text-right no-break">
                  {{ tx | fee }}
                </div>
              </div>
            </div>
          </div>
          <!-- <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >View all transactions</router-link>
          </footer>-->
        </div>

        <div class="explorer-card latest-block-card">
          <header>
            <h1 class="flex-grow">
              Validators
            </h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <th>Index</th>
                  <th>Address</th>
                  <th>Balance</th>
                </tr>
                <tr
                  v-for="(validator, index) in validators"
                  :key="validator.address"
                  class="wfont"
                >
                  <td>
                    {{ index }}
                  </td>
                  <td>
                    <Address :bech32="validator.address" :show-raw="true" />
                  </td>
                  <td>
                    {{ (validator.balance / 1e18).toFixed(2) }}
                  </td>
                </tr>
              </table>
            </section>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import store from '../explorer/store'
import LoadingMessage from './LoadingMessage'
import Address from './Address'

export default {
  name: 'ShardPage',
  components: {
    LoadingMessage,
    Address,
  },
  data() {
    return {
      globalData: store.data,
      loading: true,
      id: '',
      timer: null,
      now: Date.now(),
      showTx: true,
      holderTab: null,
    }
  },
  computed: {
    shard() {
      return this.globalData.shards[this.$route.params.id]
    },
    validators() {
      if (this.$route.params.id < this.$store.data.shardsValidators.length)
        return this.$store.data.shardsValidators[this.$route.params.id]
      return []
    },
  },
  watch: {
    shard() {
      this.resetTimer()
    },
  },
  mounted() {
    this.resetTimer()
  },
  methods: {
    resetTimer() {
      clearInterval(this.timer)
      this.now = Date.now()
      this.timer = setInterval(() => {
        this.now = Date.now()
      }, 1000)
    },
  },
}
</script>
