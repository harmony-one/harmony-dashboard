import axios from 'axios';
import { blocks, block } from './fake-data';
import store from './store';

const BACK_END_URL = `${window.location.hostname}:3000`;
const backendApiUrl = `http://${BACK_END_URL}`;

function sendPost(url, params, config) {
    return axios.post(backendApiUrl + url, params, config);
}

export default {
    BACK_END_URL,
    reset(secret) {
        return sendPost('/reset', { secret });
    },
    getBlocks() {
        return Promise.resolve(blocks).then(blocks => {
            store.setBlocks(blocks);
            return blocks;
        });
    },
    getBlock(id) {
        return Promise.resolve(block).then(block => {
            store.setBlocks(block);
            return block;
        });
    }
};