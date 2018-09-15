import axios from 'axios';

const BACK_END_URL = `${window.location.hostname}:3000`;
const backendApiUrl = `http://${BACK_END_URL}`;

function sendPost(url, params, config) {
    return axios.post(backendApiUrl + url, params, config);
}

export default {
    BACK_END_URL,
    reset(secret) {
        return sendPost('/reset', { secret });
    }
};