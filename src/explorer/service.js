import axios from 'axios';
import store from './store';

// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(this);
        }, time);
    });
}

const BACKEND_URL = `${window.location.hostname}:4000`;
const HTTP_BACKEND_URL = `http://${BACKEND_URL}`;

function sendPost(url, params, config) {
    return axios.post(HTTP_BACKEND_URL + url, params, config);
}

function sendGet(url, params) {
    return axios.get(HTTP_BACKEND_URL + url, params); // .delay(500)
}

(function listenWebsocket() {
    const ws = new WebSocket(`ws://${BACKEND_URL}`);

    ws.addEventListener("open", () => {
        ws.send("front-end: Hi.");
    });

    ws.addEventListener("message", res => {
        let data = JSON.parse(res.data);
        if (data.cmd === "reset") {
            store.reset();
        } else if (data.cmd === "blocks") {
            store.update(data);
            // console.log(data.blocks);
        }
    });

    ws.addEventListener("error", error => {
        console.log("error", error);
    });

    ws.addEventListener("close", error => {
        console.log("close");
    });
}());

export default {
    reset(secret) {
        return sendPost('/reset', { secret });
    },
    getBlocks() {
        return sendGet('/blocks').then(res => {
            let blocks = res.data.blocks;
            store.setBlocks(blocks);
            return blocks;
        });
    },
    getBlock(id) {
        return sendGet('/block', { params: { id } }).then(res => {
            let block = res.data.block;
            return block;
        });
    },
    getTransaction(id) {
        return sendGet('/tx', { params: { id } }).then(res => {
            let tx = res.data.tx;
            return tx;
        });
    },
    getAddress(id) {
        return sendGet('/address', { params: { id } }).then(res => {
            let address = res.data.address;
            return address;
        });
    },
    search(input) {
        return sendGet('/search', { params: { input } }).then(res => {
            let result = res.data.result;
            return result;
        });
    }
};