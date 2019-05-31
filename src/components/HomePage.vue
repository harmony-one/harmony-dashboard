<style scoped lang="less">
@import "../less/common.less";

.explorer-table-responsive {
  display: table;
  width: 100%;
  height: 20em;
  border-collapse: collapse;
  .th,
  .td {
    padding: @space-sm @space-xs;
    display: table-cell;
    text-align: left;
  }
  .tr {
    display: table-row;
  }
  .th {
    font-weight: bold;
    color: #777;
    font-size: 0.8em;
  }

  .td {
    color: #888;
    transition: all @anim-duration @anim-easing;
    word-break: break-word;
  }
  .tr:hover .td {
    color: #ccc;
    background-color: #282828;
  }
  .tr + .tr {
    border-top: solid 1px #2a2a2a;
  }
}

.home-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;
  header {
    .flex-horizontal;
    align-items: flex-end;
    .timer {
      color: #666;
    }
  }
  .secondary-info {
    font-size: 0.8em;
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
    footer {
      padding: 0;
      .btn {
        padding: @space-md;
      }
    }
  }
}
</style>

<template>
  <div class="home-page explorer-page page">
    <div class="home-body explorer-body">
      <div class="container" v-if="globalData.latestBlocks.length">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div class="explorer-card">
              <header>
                <h1>Block Count</h1>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-body-num">{{ globalData.blockCount }}</div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div class="explorer-card">
              <header>
                <h1>Tx Count</h1>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-body-num">{{ globalData.txCount }}</div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div class="explorer-card">
              <header>
                <h1>Node Count</h1>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-body-num">{{ globalData.nodeCount }}</div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div class="explorer-card">
              <header>
                <h1>Shard Count</h1>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-body-num">{{ globalData.shardCount }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">Latest Blocks</h1>
                <div class="secondary-info">
                  <div
                    class="timer"
                  >Settled {{ globalData.latestBlocks.length }} new block(s) {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                  <span class="total-block-num"></span>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-block-table">
                  <div class="tr">
                    <div class="th">Shard</div>
                    <div class="th">Hash</div>
                    <div class="th">Height</div>
                    <div class="th">Age</div>
                    <div class="th text-right">Transactions</div>
                  </div>
                  <div class="tr" v-for="block in globalData.latestBlocks" :key="block.id">
                    <div class="td">
                      <router-link :to="'shard/' + block.shardID">{{ block.shardID }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'block/' + block.id">{{block.id | shorten}}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'block/' + block.id">{{block.height}}</router-link>
                    </div>
                    <div class="td">{{ block.timestamp | age }}</div>
                    <div class="td text-right">{{ block.txCount }}</div>
                  </div>
                </div>
              </div>
              <footer>
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="blocks"
                >View all blocks</router-link>
              </footer>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">Latest Transactions</h1>
                <div class="secondary-info">
                  <div
                    class="timer"
                  >Updated {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                  <span class="total-block-num"></span>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">Shard</div>
                    <div class="th">From</div>
                    <div class="th">To</div>
                    <div class="th">Age</div>
                    <div class="th text-right">Value</div>
                  </div>
                  <div class="tr" v-for="tx in globalData.latestTxs" :key="tx.id">
                    <div class="td">
                      <router-link :to="'shard/' + tx.shardID">{{ tx.shardID }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'address/' + tx.from">{{tx.from | shorten }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'address/' + tx.to">{{tx.to | shorten }}</router-link>
                    </div>
                    <div class="td">{{ tx.timestamp | age }}</div>
                    <div class="td text-right">{{ tx.value | amount }}</div>
                  </div>
                </div>
              </div>
              <footer>
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >View all transactions</router-link>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <loading-message/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../explorer/store";
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";
import moment from "moment";

export default {
  name: "HomePage",
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 50,
      timer: null,
      now: Date.now()
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  watch: {
    globalData() {
      this.resetTimer();
    }
  },
  mounted() {
    this.resetTimer();
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