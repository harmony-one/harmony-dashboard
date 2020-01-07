import axios from 'axios';
import store from './store';

const BACKEND_URL = `${window.location.hostname}:3000`;
const HTTP_BACKEND_URL = `https://${BACKEND_URL}`;

function sendPost(url, params, config) {
  return axios.post(HTTP_BACKEND_URL + url, params, config);
}

(function listenWebsocket() {
  const ws = new WebSocket(`wss://${BACKEND_URL}`);
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

  ws.addEventListener('close', error => {
    console.log('close');
  });
})();

export default {
  reset(secret) {
    return sendPost('/reset', { secret });
  },
};
