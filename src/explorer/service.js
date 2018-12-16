import axios from 'axios';
import store from './store';

const BACKEND_URL = `${window.location.hostname}:4000`;
const HTTP_BACKEND_URL = `http://${BACKEND_URL}`;

function sendPost(url, params, config) {
    return axios.post(HTTP_BACKEND_URL + url, params, config);
}

function sendGet(url, params) {
    return axios.get(HTTP_BACKEND_URL + url, params); // .delay(500)
}

export default {
    BACKEND_URL,
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
    getAddress(address) {
        return sendGet('/address', { params: { address } }).then(res => {
            let address = res.data.address;
            return address;
        });
    },
    search(input) {
        return sendGet('/search', { params: { input }}).then(res => {
            let result = res.data.result;
            return result;
        });
    }
};