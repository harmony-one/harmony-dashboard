import axios from "axios";
import store from "./store";

// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(this);
    }, time);
  });
};

const BACKEND_URL = `${window.location.hostname}:8888`;
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
    if (data.error) {
      alert(`Websocket Error: ${data.error}`);
      return;
    }
    if (data.cmd === "reset") {
      store.reset();
    } else if (data.cmd === "update") {
      store.update(data);
    } else if (data.cmd === "nodeCount") {
      store.updateNodeCount(data);
    } else if (data.cmd === "init") {
      store.update(data);
      store.updateNodeCount(data);
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
  getAddress(id) {
    return authGet("/address", { params: { id } }).then(res => {
      let address = res.data.address;
      return address;
    });
  },
  getShard(id) {
    return authGet("/shard", { params: { id } }).then(res => {
      let shard = res.data.shard;
      return shard;
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
