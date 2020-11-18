import { AbiCoder } from '@harmony-js/contract'

const url = 'http://52.247.56.65:9500/' // mainnet
// const url = 'http://40.70.223.9:9500/' // testnet

const txhash =
  '0x23ade9fdc308d41b39b81a841b208d1330a23f6bb2dcf34396a805f97f1de884'

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
  if (output == undefined) return ''
  if (!output.startsWith('0x08c379a0')) return output
  output = `0x${output.slice(10)}`
  return coder.decodeParameter('string', output)
}

export function showCall(call, depth) {
  const revert =
    call.error == 'execution reverted' ? revertMsg(call.output) : ''
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
