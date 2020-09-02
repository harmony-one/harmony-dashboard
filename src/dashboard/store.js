import Vue from 'vue'

class GlobalSummary {
  tps = 0
  maxTps = 0
  txCount = 0
  blockCount = 0
  nodeCount = 0
  avgBlockLatency = 0
  shardCount = 0
  updateTime = 0
  tpsHistory = []
  constructor(shardSummaries) {
    let keys = Object.keys(shardSummaries)
    if (!keys.length) return
    keys.forEach(key => {
      let summary = shardSummaries[key]
      this.tps += summary.tps
      this.txCount += summary.txCount
      this.blockCount += summary.blockCount
      this.nodeCount += summary.nodeCount
      this.avgBlockLatency += summary.blockLatency
      this.updateTime = Math.max(this.updateTime, summary.updateTime)
    })
    this.avgBlockLatency /= keys.length
    this.shardCount = keys.length
  }
}

let store = {
  data: {
    shardSummaries: {},
    globalSummary: {},

    blocks: [],
    blockMap: {},
  },
  reset() {
    this.data.shardSummaries = {}
    this.data.globalSummary = {}
  },
  update(data) {
    if (data && data.shardSummaries) {
      Object.values(data.shardSummaries).forEach(summary => {
        Vue.set(this.data.shardSummaries, summary.key, summary)
      })
    }

    let globalSummary = new GlobalSummary(this.data.shardSummaries)
    if (data.globalSummary) {
      // The first update contains globalSummary for catching up.
      globalSummary.maxTps = data.globalSummary.maxTps
      globalSummary.tpsHistory = data.globalSummary.tpsHistory
    }
    globalSummary.maxTps = Math.max(globalSummary.maxTps, globalSummary.tps)
    if (this.data.globalSummary.maxTps) {
      globalSummary.maxTps = Math.max(
        globalSummary.maxTps,
        this.data.globalSummary.maxTps
      )
    }
    this.data.globalSummary = Object.assign({}, globalSummary)
  },
  setBlock(block) {
    if (!block) return
    Vue.set(this.data.blockMap, block.id, block)
  },
}

export default store
