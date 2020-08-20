<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="metrics-summary">
    <div class="summary-title">Shard {{ summary.key }}</div>
    <div class="timer">
      Updated {{ Math.round((now - this.summary.updateTime) / 1000) | number }}s
      ago...
    </div>
    <div class="row">
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            # of Blocks
          </div>
          <div class="card-value number">
            {{ summary.blockCount | number }}
          </div>
        </div>
      </div>
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            # of Transactions
          </div>
          <div class="card-value number">
            {{ summary.txCount | number }}
          </div>
        </div>
      </div>
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            # of Nodes Online
          </div>
          <div class="card-value number">
            {{ summary.nodeCount | number }}
          </div>
        </div>
      </div>
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Transaction Per Second
          </div>
          <div class="card-value number">
            {{ summary.tps | decimal }}
          </div>
        </div>
      </div>
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Max TPS
          </div>
          <div class="card-value number">
            {{ summary.maxTps | decimal }}
          </div>
        </div>
      </div>
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Block Latency
          </div>
          <div class="card-value number">
            {{ summary.blockLatency | decimal }}s
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div
        class="col-xs-12
            col-sm-12
            col-md-12
            col-lg-6"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Latest Block Hashes
          </div>
          <div class="card-value hashes">
            <div
              v-for="(hash, index) in summary.latestBlockHashes"
              :key="index"
              class="hash"
            >
              {{ hash || '#' }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-xs-12
            col-sm-12
            col-md-12
            col-lg-6"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Latest Transaction Hashes
          </div>
          <div class="card-value hashes">
            <div
              v-for="(hash, index) in summary.latestTxHashes"
              :key="index"
              class="hash"
            >
              {{ hash || '#' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShardSummary',
  props: ['summary'],
  data() {
    return {
      timer: null,
      now: Date.now(),
    }
  },
  watch: {
    summary() {
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
