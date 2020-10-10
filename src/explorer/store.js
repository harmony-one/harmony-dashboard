import Vue from 'vue'
import hmy from './hmy.js'
import axios from 'axios'
import {
  BASE_HRC20URL,
  HRC20_HOLDERURL,
  ONE_HOLDERURL,
  EXPLORER_BACKEND_URL,
} from './globalConfig.js'
import service from './service'

window.hmy = hmy
const HRC20_ABI = require('./HRC20_ABI.json')
const HRC20_LIST = []

const Limit = 10
function postprocessBlocks(items) {
  return items
    .sort((a, b) => (Number(a.timestamp) > Number(b.timestamp) ? -1 : 1))
    .slice(0, Limit)
}

function postprocessTxs(items) {
  return items
    .sort((a, b) => (Number(a.timestamp) > Number(b.timestamp) ? -1 : 1))
    .slice(0, Limit)
}

async function hrc20TxsFilter(items, isHrc20, exist) {
  let retTxs = []
  let txs = items.sort((a, b) =>
    Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
  )
  for (let i in txs) {
    let tx = txs[i]
    if (isHrc20(tx.to.bech32) && !exist(tx.id)) {
      if (tx.input == undefined)
        tx.input = (
          await hmy.hmySDK.blockchain.Transaction.getTransactionByHash(tx.id)
        ).result.input
      retTxs.push(tx)
    }
  }
  return retTxs.slice(0, Limit)
}

function getTotalBlockLatency(latencies) {
  latencies = latencies.filter(x => isFinite(x))
  if (!latencies.length) return NaN

  return (
    latencies.reduce((memo, latency) => memo + latency, 0) / latencies.length
  )
}

const HRC20LIST_URL = `${EXPLORER_BACKEND_URL}/hrc20-token-list`

function fetchHrc20List(url) {
  return axios.get(url).then(rez => {
    const tokenList = rez.data.map(o => ({
      ...o,
      address: o.contractAddress,
      decimals: +o.decimals,
      symbol: o.symbol || o.name,
      description: { en: '' },
      website: '',
    }))
    console.log({ tokenList })

    return tokenList
  })
}

let Hrc20Address = {}
HRC20_LIST.map(hrc20 => (Hrc20Address[hrc20.address] = hrc20))

let store = {
  data: {
    shards: {},
    shardsValidators: [],
    blocks: [],
    txs: [],
    stakingTxs: [],
    hrc20Txs: [],
    hrc20TxsCount: 0,
    blockCount: 0,
    txCount: 0,
    stakingTxCount: 0,
    nodeCount: 0,
    lastUpdateTime: 0,
    Hrc20Address,
    HRC20_ABI,
    hmy,
    HRC20_HOLDERURL,
    ONE_HOLDERURL,
  },

  update(data) {
    this.updateShards(data.shards)
    this.updateGlobalData()
  },
  async updateValidtors() {
    for (let i = 0; i < 4; i++) {
      let shardi = await hmy.hmySDK.blockchain.Staking.getValidators(i)
      this.data.shardsValidators.push(shardi.result.validators)
    }
  },
  updateHrc20List() {
    fetchHrc20List(HRC20LIST_URL).then(harc20list =>
      harc20list.map(hrc20 =>
        Vue.set(this.data.Hrc20Address, hrc20.address, {
          ...hrc20,
          logo: `${BASE_HRC20URL}/HRC20/${hrc20.address}.png`,
        })
      )
    )
  },
  updateShards(shards) {
    if (shards) {
      Object.values(shards).forEach(this.updateShard.bind(this))
    }
  },
  updateShard(shard) {
    let shardData = this.data.shards[shard.id]
    if (!shardData) {
      Vue.set(this.data.shards, shard.id, shard)
      shardData = this.data.shards[shard.id]
      shardData.blocks = shardData.blocks.slice(0, Limit)
      shardData.txs = shardData.txs.slice(0, Limit)
      shardData.stakingTxs = shardData.stakingTxs.slice(0, Limit)
      return
    }
    // don't add blocks that are already in latestBlocks
    let blockMap = {}
    shardData.blocks.forEach(b => (blockMap[b.id] = b))
    shard.blocks.forEach(b => (blockMap[b.id] = b))
    shardData.blocks = postprocessBlocks(Object.values(blockMap))

    // don't add txs that are already in latestTxs
    let txMap = {}
    shardData.txs.forEach(t => (txMap[t.id] = t))
    shard.txs.forEach(t => (txMap[t.id] = t))
    shardData.txs = postprocessTxs(Object.values(txMap))

    // don't add txs that are already in latestTxs
    let stakingTxMap = {}
    shardData.stakingTxs.forEach(t => (stakingTxMap[t.id] = t))
    shard.stakingTxs.forEach(t => (stakingTxMap[t.id] = t))
    shardData.stakingTxs = postprocessTxs(Object.values(stakingTxMap))

    shardData.blockCount = shard.blockCount
    shardData.nodeCount = shard.nodeCount
    shardData.lastUpdateTime = shard.lastUpdateTime
    shardData.txCount = shard.txCount
    shardData.stakingTxCount = shard.stakingTxCount
  },
  updateGlobalData() {
    this.data.blocks = postprocessBlocks(
      Object.values(this.data.shards).reduce(
        (memo, shard) => memo.concat(shard.blocks),
        []
      )
    )
    this.data.txs = postprocessTxs(
      Object.values(this.data.shards).reduce(
        (memo, shard) => memo.concat(shard.txs),
        []
      )
    )
    this.updateHrc20List()
    service.getHrc20TxsLatest({ pageSize: 10, pageIndex: 0 }).then(result => {
      this.data.hrc20Txs = result.txs
      this.data.hrc20TxsCount = result.total
    })
    this.data.stakingTxs = postprocessTxs(
      Object.values(this.data.shards).reduce(
        (memo, shard) => memo.concat(shard.stakingTxs),
        []
      )
    )
    this.data.blockCount = Object.values(this.data.shards).reduce(
      (memo, shard) => memo + shard.blockCount,
      0
    )
    this.data.txCount = Object.values(this.data.shards).reduce(
      (memo, shard) => memo + shard.txCount,
      0
    )
    this.data.stakingTxCount = Object.values(this.data.shards).reduce(
      (memo, shard) => memo + shard.stakingTxCount,
      0
    )
    this.data.nodeCount = Object.values(this.data.shards).reduce(
      (memo, shard) => memo + shard.nodeCount,
      0
    )
    this.data.shardCount = Object.keys(this.data.shards).length
    this.data.blockLatency = getTotalBlockLatency(
      Object.values(this.data.shards).map(s => s.blockLatency)
    )
    this.data.lastUpdateTime = Math.max(
      ...Object.values(this.data.shards)
        .map(s => s.lastUpdateTime)
        .filter(x => isFinite(x))
    )
  },
  reset() {
    this.data.blocks = []
    this.data.txs = []
    this.data.stakingTxs = []
    this.data.blockCount = 0
    this.data.txCount = 0
    this.data.stakingTxCount = 0
    this.data.nodeCount = 0
    this.data.nodes = {}
    this.data.shardCount = 0
  },
}

store.updateValidtors()

Vue.prototype.$store = store

export default store
