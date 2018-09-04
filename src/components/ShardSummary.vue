<style scoped lang="less">
@import "../less/common.less";

.shard-summary {
  color: var(--primary-text-color);
  border-radius: @border-radius;
  background-color: #fff;
  padding: @space-md;
  .summary-title {
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5em;
    word-break: break-all;
  }

  .timer {
    text-align: right;
    color: var(--secondary-text-color);
    font-size: 0.8em;
  }
  .dashboard-card {
    border-radius: @border-radius;
    background-color: #f7f7f7;
    padding: @space-md;
    display: block;
    min-width: 12em;
    margin: @space-sm 0;
    .card-title {
      color: var(--secondary-text-color);
    }
    .card-value {
      word-break: break-all;
      &.number {
        font-size: 3em;
        text-align: center;
      }
      &.hashes {
        text-align: left;
        padding-top: 0.5em;
        .hash {
          padding: 0.5em 0;
          font-size: 0.9em;
        }
        .hash + .hash {
          border-top: 1px solid #dfdfdf;
        }
      }
    }
  }
}

.shard-summary + .shard-summary {
  margin-top: 1em;
}
</style>

<template>
    <div class="shard-summary">
        <div class="summary-title">Shard {{ summary.key }}</div>
        <div class="timer">Updated {{ metricsLatency }}s ago...</div>
        <div class="row">
            <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
                <div class="dashboard-card">
                    <div class="card-title"># of Blocks</div>
                    <div class="card-value number">{{ summary.blockCount }}</div>
                </div>
            </div>
            <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
                <div class="dashboard-card">
                    <div class="card-title"># of Transactions</div>
                    <div class="card-value number">{{ summary.txCount }}</div>
                </div>
            </div>
            <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
                <div class="dashboard-card">
                    <div class="card-title"># of Nodes Online</div>
                    <div class="card-value number">{{ summary.nodeCount }}</div>
                </div>
            </div>
            <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
                <div class="dashboard-card">
                    <div class="card-title">Transaction Per Second</div>
                    <div class="card-value number">{{ summary.tps }}</div>
                </div>
            </div>
            <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
                <div class="dashboard-card">
                    <div class="card-title">Block Latency</div>
                    <div class="card-value number">{{ summary.blockLatency }}s</div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12
            col-sm-12
            col-md-12
            col-lg-6">
                <div class="dashboard-card">
                    <div class="card-title">Latest Block Hashes</div>
                    <div class="card-value hashes">
                        <div class="hash" v-for="(hash, index) in summary.latestBlockHashes" :key="index">{{ hash || '#' }}</div>
                    </div>
                </div>
            </div>
            <div class="col-xs-12
            col-sm-12
            col-md-12
            col-lg-6">
                <div class="dashboard-card">
                    <div class="card-title">Latest Transaction Hashes</div>
                    <div class="card-value hashes">
                        <div class="hash" v-for="(hash, index) in summary.latestTxHashes" :key="index">{{ hash || '#' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
const ws = new WebSocket("ws://localhost:3000");

export default {
  name: "ShardSummary",
  props: ["summary"],
  data() {
    return {
      timer: null,
      metricsLatency: 0
    };
  },
  watch: {
    summary() {
      this.resetTimer();
    }
  },
  methods: {
    resetTimer() {
      clearInterval(this.timer);
      this.metricsLatency = 0;
      this.timer = setInterval(() => {
        this.metricsLatency++;
      }, 1000);
    }
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {
    this.resetTimer();
  }
};
</script>