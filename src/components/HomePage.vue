<style scoped lang="less">
@import "../less/common.less";

.explorer-card-body {
  min-height: 24em;
  box-sizing: content-box;
}

.home-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  header {
    .flex-horizontal;
    align-items: flex-end;
  }

  .latest-block-card {
    table {
      th {
        position: sticky;
        top: 0;
        background-color: var(--color-card-background);
      }
      height: 20em;
      overflow: auto;
    }
  }
}
</style>

<template>
  <div class="home-page explorer-page page">
    <div class="home-body explorer-body">

      <div class="container" v-if="globalData.blocks.length">

        <div class="explorer-card status-card" v-if="!!coinStats">
          <CoinStats :stats="coinStats" />
        </div>

        <div class="explorer-card status-card">
          <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-block-count"></div>
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">{{ globalData.blockCount | number }}</div>
                  <h1>Block Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-tx-count"></div>
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">{{ globalData.blockLatency | blockLatency }}</div>
                  <h1>Block Latency</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-node-count"></div>
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">{{ globalData.nodeCount | number }}</div>
                  <h1>Node Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-shard-count"></div>
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">{{ globalData.shardCount | number }}</div>
                  <h1>Shard Count</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">Latest Blocks</h1>
                <div class="secondary-info">
                  <div class="timer">Updated {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                  <span class="total-block-num"></span>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-block-table">
                  <div class="tr">
                    <div class="th">Shard</div>
                    <div class="th">Hash</div>
                    <div class="th">Height</div>
                    <div class="th text-right">Timestamp</div>
                    <div class="th text-right">Age</div>
                    <div class="th text-right" v-if="showTx">Transactions</div>
                  </div>
                  <div class="tr" v-for="block in globalData.blocks" :key="block.id">
                    <div class="td">
                      <router-link :to="'/shard/' + block.shardID">{{ block.shardID }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/block/' + block.id">{{block.id | shorten}}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/block/' + block.id">{{block.height | number }}</router-link>
                    </div>
                    <div class="td text-right">{{ block.timestamp | timestamp }}</div>
                    <div class="td text-right">{{ block.timestamp | age }}</div>
                    <div class="td text-right" v-if="showTx">{{ block.txCount }}</div>
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
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="showTx">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">Latest Transactions</h1>
                <div class="secondary-info">
                  <div class="timer">Updated {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                  <span class="total-block-num"></span>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">Shard</div>
                    <div class="th">Hash</div>
                    <div class="th">From</div>
                    <div class="th">To</div>
                    <div class="th">Age</div>
                    <div class="th text-right">Value</div>
                  </div>
                  <div class="tr" v-for="tx in globalData.txs" :key="tx.id">
                    <div class="td">
                      <router-link :to="'/shard/' + tx.shardID">{{ tx.shardID }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/tx/' + tx.id">{{ tx.id | shorten }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.from.bech32">{{tx.from.bech32 | shorten }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.to.bech32">{{tx.to.bech32 | shorten }}</router-link>
                    </div>
                    <div class="td">{{ tx.timestamp | age }}</div>
                    <div class="td text-right">{{ tx.value | amount }}</div>
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
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="showStakingTx">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">Latest Staking Transactions</h1>
                <div class="secondary-info">
                  <div class="timer">Updated {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                  <span class="total-block-num"></span>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">Shard</div>
                    <div class="th">Hash</div>
                    <div class="th">Validator</div>
                    <div class="th">Delegator</div>
                    <div class="th">Age</div>
                    <div class="th text-right">Value</div>
                  </div>
                  <div class="tr" v-for="tx in globalData.stakingTxs" :key="tx.id">
                    <div class="td">
                      <router-link :to="'/shard/' + tx.shardID">{{ tx.shardID }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/staking-tx/' + tx.id">{{ tx.id | shorten }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.validator.bech32">{{tx.validator.bech32 | shorten }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.delegator.bech32">{{tx.delegator.bech32 | shorten }}</router-link>
                    </div>
                    <div class="td">{{ tx.timestamp | age }}</div>
                    <div class="td text-right">{{ tx.value | amount }}</div>
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
          </div>

        </div>
      </div>
      <div class="container" v-else>
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../explorer/store";
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";
import CoinStats from "./CoinStats";
import moment from "moment";


export default {
  name: "HomePage",
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 50,
      timer: null,
      now: Date.now(),
      showTx: true,
      showStakingTx: true,
      coinStats: null,
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage,
    CoinStats
  },
  watch: {
    globalData() {
      this.resetTimer();
    }
  },
  mounted() {
    this.resetTimer();

    service.getCoinStats().then(stats => {
      this.coinStats = stats
    });
  },
  computed: {
    length() {
      return Math.ceil(this.globalData.blocks.length / this.pageSize);
    }
  },
  methods: {
    resetTimer() {
      clearInterval(this.timer);
      this.now = Date.now();
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    }
  }
};
</script>
