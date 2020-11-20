import { AbiCoder } from '@harmony-js/contract'
import { SDK_NODE } from '../explorer/globalConfig.js'

const isMainnet = () => SDK_NODE !== 'https://api.s0.b.hmny.io'
const url = isMainnet() ? 'https://api0.s0.t.hmny.io' : 'https://api.s0.b.hmny.io'

export async function traceTx(txhash) {
  const body = `{
        "jsonrpc":"2.0",
        "id":0,
        "method":"debug_traceTransaction",
        "params":["${txhash}", {"tracer": "callTracer"}]
    }`
  const msg = await fetch(url, {
    headers: { 'content-type': 'application/json' },
    body,
    method: 'POST',
  })
  return msg.json()
}

export function revertMsg(output) {
  const coder = AbiCoder()
  if (output === undefined) return ''
  if (!output.startsWith('0x08c379a0')) return output
  output = `0x${output.slice(10)}`
  return coder.decodeParameter('string', output)
}

export function showCall(call, depth = 0) {
  const revert =
    call.error === 'execution reverted' ? revertMsg(call.output) : ''
  const fmtmsg = `${' '.repeat(depth * 4)} ${call.type} from:${call.from} to:${
    call.to
  } value:${call.value}, input:${call.input} ${revert}`
  console.log(fmtmsg)
  if (call.calls) call.calls.forEach(call => showCall(call, depth + 1))
}

/*
async function main(){
  const resp = await traceTxs(txhash);
  let depth = 0;
  let call = resp.result;
  //console.log(call);
  showCall(call, 0)
}

main();*/
