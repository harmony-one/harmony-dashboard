import axios from 'axios';

const BACKEND_URL = `${window.location.hostname}:3000`;
const HTTP_BACKEND_URL = `http://${BACKEND_URL}`;

function sendPost(url, params, config) {
    return axios.post(HTTP_BACKEND_URL + url, params, config);
}

export default {
    BACKEND_URL,
    reset(secret) {
        return sendPost('/reset', { secret });
    }
};