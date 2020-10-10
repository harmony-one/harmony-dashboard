/*
import axios from 'axios'
import store from './store'
import { EXPLORER_BACKEND_WS, EXPLORER_BACKEND_URL } from '../explorer/globalConfig.js'


function sendPost(url, params, config) {
  return axios.post(EXPLORER_BACKEND_URL + url, params, config)
}

;(function listenWebsocket() {
  const ws = new WebSocket(EXPLORER_BACKEND_WS)
  ws.addEventListener('open', () => {
    ws.send('front-end: Hi.')
  })

  ws.addEventListener('message', res => {
    let data = JSON.parse(res.data)
    if (data.cmd === 'reset') {
      store.reset()
    } else {
      store.update(data)
    }
  })

  ws.addEventListener('error', error => {
    console.log('error', error)
  })

  ws.addEventListener('close', () => {
    console.log('close')
  })
})()

export default {
  reset(secret) {
    return sendPost('/reset', { secret })
  },
}
*/
