import axios from 'axios'
import store from './store'
import {
  EXPLORER_BACKEND_URL,
  EXPLORER_BACKEND_WS,
  INSIGHT_BACKEND_URL,
  SECRET,
} from './globalConfig.js'

// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(this)
    }, time)
  })
}

function sendPost(url, params, config) {
  return axios.post(EXPLORER_BACKEND_URL + url, params, config)
}

function authGet(url, _params) {
  let params = Object.assign(
    {
      headers: { Authorization: 'Bearer ' + SECRET },
    },
    _params
  )
  return sendGet(url, params)
}

function sendGet(url, params) {
  //if(url == '/hrc20-txs' || url == '/hrc20-latest')
  //  return axios.get('http://127.0.0.1:8080' + url, params); // .delay(500)
  return axios.get(EXPLORER_BACKEND_URL + url, params) // .delay(500)
}

;(function listenWebsocket() {
  const ws = new WebSocket(EXPLORER_BACKEND_WS, [SECRET])

  ws.addEventListener('open', () => {
    ws.send('front-end: Hi.')
  })

  ws.addEventListener('message', res => {
    let data = JSON.parse(res.data)

    if (data.shards) {
      data.shards = Object.values(data.shards).map(shard => ({
        stakingTxCount: 0,
        stakingTxs: [],
        ...shard,
      }))
    }

    if (data.error) {
      alert(`Websocket Error: ${data.error}`)
      return
    }
    if (data.cmd === 'reset') {
      store.reset()
    } else if (data.cmd === 'update') {
      store.update(data)
    } else if (data.cmd === 'init') {
      store.update(data)
    }
  })

  ws.addEventListener('error', error => {
    console.log('error', error)
  })

  ws.addEventListener('close', () => {
    console.log('close')
  })
})()

export default {
  reset(secret) {
    return sendPost('/reset', { secret })
  },
  getBlocks(pageIndex, pageSize) {
    return authGet('/blocks', { params: { pageIndex, pageSize } }).then(res => {
      let blocks = res.data.blocks

      return blocks
    })
  },
  getBlock(id) {
    return authGet('/block', { params: { id } }).then(res => {
      let block = res.data.block

      return block
    })
  },
  getTransactions(cursor, size) {
    return authGet('/txs-new', { params: { cursor, size } }).then(res => {
      let txs = res.data.txs

      return txs
    })
  },
  getStakingTransactions(cursor, size) {
    return authGet('/staking-txs-new', { params: { cursor, size } }).then(
      res => {
        let txs = res.data.txs

        return txs
      }
    )
  },
  getTransaction(id) {
    return authGet('/tx', { params: { id } }).then(res => {
      let tx = res.data.tx

      return tx
    })
  },
  getStakingTransaction(id) {
    return authGet('/staking-tx', { params: { id } }).then(res => {
      let tx = res.data.tx

      return tx
    })
  },
  getCoinStats() {
    return authGet('/coin-stats').then(res => {
      const coinStats = res.data.coinStats

      return coinStats
    })
  },
  getAddress(params) {
    return authGet('/address', { params }).then(res => {
      let address = res.data.address
      return res.data
    })
  },
  getAddressFullInfo(params) {
    return authGet('/address', { params }).then(res => {
      return res.data
    })
  },
  getHrc20Txs(params) {
    return authGet('/hrc20-txs', { params }).then(res => {
      return res.data
    })
  },
  getHrc20TxsLatest(params) {
    return authGet('/hrc20-latest', { params }).then(res => {
      return res.data
    })
  },
  getTxHistory(address, shardID, pageIndex) {
    return authGet('/tx-history', {
      params: { id: address, shardID, txView: 'ALL', pageIndex, pageSize: 25 },
    }).then(res => {
      let address = res.data.address
      return address
    })
  },
  getAddressShard(params) {
    return authGet('/address-shard', { params }).then(res => {
      let address = res.data.address
      return address
    })
  },
  getAddressShardTxHistory(address, shardID, pageIndex, pageSize) {
    return authGet('/address-shard-txs', {
      params: { address, shardID, pageIndex, pageSize },
    }).then(res => {
      let txs = res.txs
      return txs
    })
  },
  getAddressShardStakingTxHistory(address, shardID, pageIndex, pageSize) {
    return authGet('/address-shard-staking-txs', {
      params: { address, shardID, pageIndex, pageSize },
    }).then(res => {
      let txs = res.txs
      return txs
    })
  },
  search(input) {
    return authGet('/search', { params: { input } }).then(res => {
      let result = res.data.result
      return result
    })
  },
  getCxReceipt(id) {
    return authGet('/cx-receipt', { params: { id } }).then(res => {
      return res.data.receipt
    })
  },
  getValidatorByAddress(address) {
    return axios.get(INSIGHT_BACKEND_URL +
      "/validator_by_address?address=" +
      address);
  },
}
