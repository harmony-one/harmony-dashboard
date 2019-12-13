import axios from "axios";
import store from "./store";

const stakingTx = {
  "blockHash": "0x4f36504b0d901b9fc8809ca8d5a276cc7b333ecc4965e27a3cede9b26538c598",
  "blockNumber": "0x8af4",
  "from": "one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy",
  "gas": "0x927c0",
  "gasPrice": "0x61a8",
  "hash": "0x84b88be8f8281ffee30aaa2a323fc655e69010d6ba00ceb1f48d59fa409c2878",
  "nonce": "0x14",
  "transactionIndex": "0x0",
  "v": "0x29",
  "r": "0x5c9e13ff76739a021fb8f0c91298770f82b29e54db7d6f405d87520adc302bd4",
  "s": "0x6384947137b57fb18bd1e216bd76a5371d17184b021ef424a48f12aec3efe9ba",
  "type": "Delegate",
  "value":"0x1158e460913d00000",
  "shardID":1,
  "toShardID":1,
  "delegator": "0x0b585f8daefbc68a311fbd4cb20d9174ad174016",
  "validator": "0x5aab47ef2bb8ceaf414c213d2b179a4fb135c0bc",
  "msg": {
    "amount": "0x1bc16d674ec80000",
    "delegatorAddress": "0x0b585f8daefbc68a311fbd4cb20d9174ad174016",
    "validatorAddress": "0x5aab47ef2bb8ceaf414c213d2b179a4fb135c0bc"
  }
};

const Txn = {
  "blockHash":"0x85ad0c995581d320bbd7d444b1154739d5d17a003e6ad21e4d4c825991907d4f",
  "blockNumber":"0x666b5",
  "from":"one1qs20hq6ljf3g0uj5fdfj4cgpd73gntcfl8nuuz",
  "gas":"0x6270",
  "gasPrice":"0x9502f9000",
  "hash":"0xf9ea258da332394fd53abb2861841d8a2174311ba70c9f6fbc3c371f79e5dd44",
  "input":"0x",
  "nonce":"0x2",
  "to":"one1gm6z5pp0lv9vg0nk4gpf8wuk97rlefwcy2nzua",
  "transactionIndex":"0x0",
  "value":"0x1158e460913d00000",
  "shardID":1,
  "toShardID":1,
  "v":"0x27",
  "r":"0xd8ef786b74ffecfed8fd5a78f9f571c82b2884d38cf95d48c2ef542bf71f11fe",
  "s":"0x2fa788a1c545cc0e29ff18689100a2745dcc55b1a3db8041d1327c9cb24b0766"
}

// stakingTxs: StakingTxSummary[];
// stakingTxCount
//
// export class StakingTxSummary {
//   id: string;
//   timestamp: number;
//   from: Address;
//   blockID: string;
//   shardID: number;
//   type: string;
//   message: any;
//   constructor(tx: RawStakingTx) {
//     this.id = tx.id;
//     this.timestamp = tx.timestamp;
//     this.from = new Address(tx.from);
//     this.blockID = tx.blockID;
//     this.shardID = tx.shardID;
//     this.type = tx.type;
//     this.message = tx.message;
//   }
// "msg": {
//   "amount": "0x1bc16d674ec80000",
//     "delegatorAddress": "0x0b585f8daefbc68a311fbd4cb20d9174ad174016",
//     "validatorAddress": "0x5aab47ef2bb8ceaf414c213d2b179a4fb135c0bc"
// }
// }

const message = {
    delegator: { bech32: "0x0b585f8daefbc68a311fbd4cb20d9174ad174016" },
    validator: { bech32: "0x5aab47ef2bb8ceaf414c213d2b179a4fb135c0bc" },
    type: 'Delegate',
}

// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(this);
    }, time);
  });
};

// const BACKEND_URL = `${'explorer.testnet.harmony.one'}:8888`;
const BACKEND_URL = `${'explorer.testnet.harmony.one'}:8888`;

const HTTP_BACKEND_URL = `https://${BACKEND_URL}`;
const SECRET = localStorage.getItem("secret");

function sendPost(url, params, config) {
  return axios.post(HTTP_BACKEND_URL + url, params, config);
}

function authGet(url, _params) {
  let params = Object.assign(
    {
      headers: { Authorization: "Bearer " + SECRET }
    },
    _params
  );
  return sendGet(url, params);
}

function sendGet(url, params) {
  return axios.get(HTTP_BACKEND_URL + url, params); // .delay(500)
}

(function listenWebsocket() {
  const ws = new WebSocket(`wss://${BACKEND_URL}`, [SECRET]);

  ws.addEventListener("open", () => {
    ws.send("front-end: Hi.");
  });

  ws.addEventListener("message", res => {
    let data = JSON.parse(res.data);

    data.shards = Object.values(data.shards)
      .map(shard => ({ ...shard, stakingTxCount: 20, stakingTxs: Object.values(shard.txs).map(tx => ({ ...tx, ...message })) }));

    if (data.error) {
      alert(`Websocket Error: ${data.error}`);
      return;
    }
    if (data.cmd === "reset") {
      store.reset();
    } else if (data.cmd === "update") {
      store.update(data);
    } else if (data.cmd === "init") {
      store.update(data);
    }
  });

  ws.addEventListener("error", error => {
    console.log("error", error);
  });

  ws.addEventListener("close", error => {
    console.log("close");
  });
})();

export default {
  reset(secret) {
    return sendPost("/reset", { secret });
  },
  getBlocks(pageIndex, pageSize) {
    return authGet("/blocks", { params: { pageIndex, pageSize } }).then(res => {
      let blocks = res.data.blocks;

      console.log(333, blocks);

      return blocks;
    });
  },
  getBlock(id) {
    return authGet("/block", { params: { id } }).then(res => {
      let block = res.data.block;

      return block;
    });
  },
  getTransactions(pageIndex, pageSize) {
    return authGet("/txs", { params: { pageIndex, pageSize } }).then(res => {
      let txs = res.data.txs;

      return txs;
    });
  },
  getTransaction(id) {
    return authGet("/tx", { params: { id } }).then(res => {
      let tx = res.data.tx;

      return tx;
    });
  },
  getStakingTransaction(id) {
    return Promise.resolve(stakingTx);

    return authGet("/stakingTx", { params: { id } }).then(res => {
      let tx = res.data.tx;

      return tx;
    });
  },
  getCoinStats() {
    return Promise.resolve({
      "id":"harmony",
      "icon":"https://static.coinstats.app/coins/Harmonyz84Ap.png",
      "name":"Harmony",
      "symbol":"ONE",
      "rank":136,
      "price":0.00570994,
      "priceBtc":7.9362072368175e-7,
      "volume":15846488,
      "marketCap":20979441,
      "availableSupply":3675123043.7235,
      "totalSupply":12600000000,
      "priceChange1h":1.22,
      "priceChange1d":2.88,
      "priceChange1w":-3.13,
      "contractAddress":"ONE-5F9",
      updateTime: Date.now(),
    });

    // return Promise.resolve({
    //   "price": 0.0030668,
    //   "volume": 17066714,
    //   "marketCap": 0,
    //   "supply": 13348074355,
    //   "change": -3.14,
    // });

    return authGet("/coinStats").then(res => {
      const coinStats = res.data.coinStats;

      return coinStats;
    });
  },
  getAddress(id) {
    return authGet("/address", { params: { id } }).then(res => {
      let address = res.data.address;
      return address;
    });
  },
  getTxHistory(address, shardID, pageIndex) {
    return authGet("/txHistory", {
      params: { id: address, shardID, txView: "ALL", pageIndex, pageSize: 25 }
    }).then(res => {
      let address = res.data.address;
      return address;
    });
  },
  getAddressShardSummary(address, shardID) {
    return authGet("/address-shard", { params: { address, shardID } }).then(
      res => {
        let address = res.data.address;
        return address;
      }
    );
  },
  getAddressShardTxHistory(address, shardID, pageIndex, pageSize) {
    return authGet("/address-shard-txs", {
      params: { address, shardID, pageIndex, pageSize }
    }).then(res => {
      console.log(res)
      let txs = res.data.txs;
      return txs;
    });
  },
  search(input) {
    return authGet("/search", { params: { input } }).then(res => {
      let result = res.data.result;
      return result;
    });
  },
  getCxReceipt(id) {
    return authGet("/cx-receipt", { params: { id } }).then(res => {
      return res.data.receipt;
    });
  }
};
