import axios from 'axios';
import store from './store';
import {DASHBOARD_BACKEND_URL} from '../explorer/globalConfig.js'

const BACKEND_URL = DASHBOARD_BACKEND_URL;
const HTTP_BACKEND_URL = `https://${BACKEND_URL}:3000`;

function sendPost(url, params, config) {
  return axios.post(HTTP_BACKEND_URL + url, params, config);
}

(function listenWebsocket() {
  const ws = new WebSocket(`wss://${BACKEND_URL}:8888`);
  ws.addEventListener('open', () => {
    ws.send('front-end: Hi.');
  });

  ws.addEventListener('message', res => {
    let data = JSON.parse(res.data);
    if (data.cmd === 'reset') {
      store.reset();
    } else {
      store.update(data);
    }
  });

  ws.addEventListener('error', error => {
    console.log('error', error);
  });

  ws.addEventListener('close', () => {
    console.log('close');
  });
})();

export default {
  reset(secret) {
    return sendPost('/reset', { secret });
  },
};
