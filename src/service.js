import axios from 'axios';
import store from './store';
import explorerStore from './explorer/store';

const BACK_END_URL = `${window.location.hostname}:3000`;
const backendApiUrl = `http://${BACK_END_URL}`;

function sendPost(url, params, config) {
    return axios.post(backendApiUrl + url, params, config);
}

// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(this);
        }, time);
    });
}

function sendGet(url, params) {
    return axios.get(backendApiUrl + url, params).delay(500);
}

export default {
    BACK_END_URL,
    reset(secret) {
        return sendPost('/reset', { secret });
    },
    getBlocks() {
        return sendGet('/blocks').then(res => {
            let blocks = res.data.blocks;
            explorerStore.setBlocks(blocks);
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
    getAddress(address) {
        return sendGet('/address', { params: { address } }).then(res => {
            let address = res.data.address;
            return address;
        });
    }
};