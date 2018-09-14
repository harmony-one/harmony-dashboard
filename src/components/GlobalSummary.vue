<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div class="metrics-summary">
    <div class="summary-title">Global</div>
    <div class="timer">Updated {{ metricsLatency }}s ago...</div>
    <div class="row">
      <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
        <div class="dashboard-card">
          <div class="card-title"># of Shards</div>
          <div class="card-value number">{{ summary.shardCount }}</div>
        </div>
      </div>
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
          <div class="card-value number">{{ summary.tps | decimal }}</div>
        </div>
      </div>
      <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
        <div class="dashboard-card">
          <div class="card-title">Max Tps</div>
          <div class="card-value number">{{ summary.maxTps | decimal }}</div>
        </div>
      </div>
      <div class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3">
        <div class="dashboard-card">
          <div class="card-title">Average Block Latency</div>
          <div class="card-value number">{{ summary.avgBlockLatency | decimal }}s</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  mounted() {
    this.resetTimer();
  }
};
</script>