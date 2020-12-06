import {AbiCoder} from '@harmony-js/contract';
import {SDK_NODE} from '../explorer/globalConfig.js';
import * as hmy from '../explorer/hmy';
import {isHrc20Deploy, getTxHrc20Method, getHrc20ContractProps} from './hrc20Utils';
import {fetchSuggestions} from './suggestSignature';
import {displayAmount} from '@/utils/displayAmount';

const {hmySDK} = hmy.default;


const isMainnet = () => SDK_NODE !== 'https://api.s0.b.hmny.io';
const url = isMainnet()
  ? 'https://api0.s0.t.hmny.io'
  : 'https://api.s0.b.hmny.io';

export async function traceTx(txhash) {
  const body = `{
        "jsonrpc":"2.0",
        "id":0,
        "method":"debug_traceTransaction",
        "params":["${txhash}", {"tracer": "callTracer"}]
    }`;
  const msg = await fetch(url, {
    headers: {'content-type': 'application/json'},
    body,
    method: 'POST',
  });
  const json = await msg.json();

  console.log({trace: JSON.parse(JSON.stringify(json.result))});
  return json;
}

const decimals = hrc20Props => param => {

  if (param.name === 'value') {
    param.value = displayAmount(param.value, hrc20Props.decimals);
  }

  return param;
};

export const traverseCallInfo = async (callHead) => {
  const res = [];

  const buildView = (callWithInfo) => {
    const type = callWithInfo.traceCall.type;
    const displayDecimals = decimals(callWithInfo.hrc20Props);

    let displayString = '';
    let displayType = '';
    if (type === 'CALL' || type === 'STATICCALL') {
      displayType = type;

      if (callWithInfo.hrc20Method) {
        displayType = 'HRC20 ' + type;
        const {method, inputs, outputs} = callWithInfo.hrc20Method;

        const inputsString = inputs.map(displayDecimals)
          .map(a => `${a.name}: ${a.value}`).join(',');
        const outputsString = outputs.map(displayDecimals)
          .map(a => `${a.name}: ${a.value}`).join(',');

        displayString = `${method.name}(${inputsString}) → ${outputsString}`;
      } else if (callWithInfo.suggestions && callWithInfo.suggestions.length) {

        const buildSuggestion = s => {
          const inputsString = s.inputs ? s.inputs.map(a => `${a.type}: ${a.value}`).join(',') : '';
          // todo outputs not provided
          return `${s.method.name}(${inputsString})`;
        };

        displayString = 'Suggested method ' + callWithInfo.suggestions.map(buildSuggestion).join(' ');
      }
    } else if (type === 'CREATE') {
      displayType = type;
      if (callWithInfo.isHrc20Deploy) {
        displayString = 'HRC20 Deployment'
      }
    }

    return {displayString, displayType, callWithInfo};
  };

  const traverse = async (call) => {
    if (!call) {
      return;
    }

    const r = buildView(await getCallInfo(call));
    res.push(r);

    call.calls && await Promise.all(call.calls.map(traverse));
  };

  await traverse(callHead);

  console.log({interactions: JSON.parse(JSON.stringify(res))})
  return res.filter(r => r.callWithInfo.traceCall.input && r.callWithInfo.traceCall.input !== '0x');
};


const getCallInfo = async (call) => {
  if (call.type === 'CALL' || call.type === 'STATICCALL') {
    const hrc20Props = await getHrc20ContractProps(call.to);
    const hrc20Method = getTxHrc20Method(call);
    const suggestions =  hrc20Method || call.input && call.input === '0x'
      ? null : await fetchSuggestions(call.input);

    return {
      from: hmySDK.crypto.toBech32(call.from),
      to: hmySDK.crypto.toBech32(call.to),
      traceCall: call,
      hrc20Props,
      suggestions,
      hrc20Method,
    };
  }

  return {
    from: hmySDK.crypto.toBech32(call.from),
    to: hmySDK.crypto.toBech32(call.to),
    traceCall: call,
    isHrc20Deploy: isHrc20Deploy(call),
  };
};

export const getFailureMessages = (call) => {
  const res = [];
  const traverse = call => {
    if (call.error === 'execution reverted') {
      const message = revertMsg(call.output);

      if (message) {
        res.push(message);
      }

    }

    call.calls && call.calls.forEach(traverse);
  };

  traverse(call);
  return res;
};

export function revertMsg(output) {
  const coder = AbiCoder();
  if (output === undefined) return '';
  if (!output.startsWith('0x08c379a0')) return output;
  output = `0x${output.slice(10)}`;
  return coder.decodeParameter('string', output);
}

export function showCall(call, depth = 0) {
  const revert =
    call.error === 'execution reverted' ? revertMsg(call.output) : '';
  const fmtmsg = `${' '.repeat(depth * 4)} ${call.type} from:${call.from} to:${
    call.to
  } value:${call.value}, input:${call.input} ${revert}`;
  console.log(fmtmsg);
  if (call.calls) call.calls.forEach(call => showCall(call, depth + 1));
}

