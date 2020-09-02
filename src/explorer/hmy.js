import { SDK_NODE } from './globalConfig.js'

const { Harmony } = require('@harmony-js/core')
const { ChainID, ChainType } = require('@harmony-js/utils')
const stakingAPIs = require('./stakingAPIs.json')

const shardID = 0
const hmySDK = new Harmony(
  // rpc url
  SDK_NODE,
  {
    // chainType set to Harmony
    chainType: ChainType.Harmony,
    // chainType set to HmyLocal
    chainId: SDK_NODE !== 'https://api.s0.b.hmny.io' ? ChainID.HmyMainnet : ChainID.HmyTestnet,
    shardID,
  }
)

const GAS_PRICE = new hmySDK.utils.Unit(1).asGwei().toHex() // 1Gwei

stakingAPIs.map(mod => {
  let modname = mod.name.split(' ')[0]
  let methodsObj = {}
  mod.methods.map(method => {
    let name = method.startsWith('hmy_') ? method.slice(4) : method
    methodsObj[name] = function() {
      return hmySDK.messenger
        .send(method, Array.from(arguments))
        .then(result => result.getRaw)
    }
  })
  hmySDK.blockchain[modname] = methodsObj
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function walletInit() {
  let retry = 0
  while (!window.harmony && retry++ < 2) await sleep(1000)
  if (!window.harmony) throw { message: '请安装麦子钱包' }
}

let address = null
async function login() {
  await walletInit()
  let account = await window.harmony.getAccount()
  address = account.address
  return account
  //return {address:'one16xh2u9r4677egx4x3s0u966ave90l37hh7wq72'}
}

async function logout() {
  await walletInit()
  address = null
  return window.harmony.forgetIdentity()
}

function delegate(from, to, amount) {
  let tx = hmySDK.stakings
    .delegate({
      delegatorAddress: from,
      validatorAddress: to,
      amount: new hmySDK.utils.Unit(amount).asWei().toHex(),
    })
    .setTxParams({
      gasPrice: GAS_PRICE,
      gasLimit: '0x0927c0',
      chainId: hmySDK.chainId,
    })
    .build()
  tx.setFromAddress(from)
  window.dtx = tx
  return tx
}

function withdrawReward(from) {
  let tx = hmySDK.stakings
    .collectRewards({
      delegatorAddress: from,
    })
    .setTxParams({
      gasPrice: GAS_PRICE,
      gasLimit: '0x0927c0',
      chainId: hmySDK.chainId,
    })
    .build()
  tx.setFromAddress(from)
  window.rtx = tx
  return tx
}

function undelegate(from, to, amount) {
  let tx = hmySDK.stakings
    .undelegate({
      delegatorAddress: from,
      validatorAddress: to,
      amount: new hmySDK.utils.Unit(amount).asWei().toHex(),
    })
    .setTxParams({
      gasPrice: GAS_PRICE,
      gasLimit: '0x0927c0',
      chainId: hmySDK.chainId,
    })
    .build()
  tx.setFromAddress(from)
  window.udtx = tx
  return tx
}

function transfer(from, to, amount) {
  let tx = hmySDK.transactions.newTx({
    from,
    //  token send to
    to,
    // amount to send
    value: new hmySDK.utils.Unit(amount).asWei().toHex(),
    // gas limit, you can use string
    gasLimit: '210000',
    // send token from shardID
    shardID: 0,
    // send token to toShardID
    toShardID: 0,
    // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
    gasPrice: GAS_PRICE,
  })
  window.tx = tx
  return tx
}

function contract(
  abi,
  to,
  options = {
    from: address ? hmySDK.crypto.fromBech32(address) : '',
    gas: '210000',
    gasPrice: GAS_PRICE,
  }
) {
  let contract = hmySDK.contracts.createContract(abi, to, options)
  if (window.harmony)
    contract.wallet.signTransaction = window.harmony.signTransaction // or importPrivate
  let decodeParameters = (abi, hexdata) => {
    if (0 == abi.length) return []
    let params = contract.abiCoder.decodeParameters(abi, hexdata)
    params.length = abi.length
    //for (let i = 0; i < abi.length; i++) {
    //  if (abi[i].type.startsWith('address'))
    //    params[i] = hmySDK.crypto.toBech32(params[i]);
    //}
    return Array.from(params)
  }
  for (let name in contract.abiModel.getMethods()) {
    let method = contract.abiModel.getMethod(name)
    method.decodeInputs = hexData => decodeParameters(method.inputs, hexData)
    method.decodeOutputs = hexData => decodeParameters(method.outputs, hexData)
  }

  contract.decodeInput = hexData => {
    let no0x = hexData.startsWith('0x') ? hexData.slice(2) : hexData
    let sig = no0x.slice(0, 8).toLowerCase()
    let method = contract.abiModel.getMethod('0x' + sig)
    if (!method) return false
    let argv = method.decodeInputs('0x' + no0x.slice(8))
    let obj = contract.methods['0x' + sig](...argv)

    for (let i = 0; i < obj.params.length; i++) {
      if (obj.abiItem.inputs[i].type == 'address')
        obj.params[i] = hmySDK.crypto.toBech32(obj.params[i])
    }
    obj.toString = () => {
      let str = obj.abiItem.name + '('
      for (let i = 0; i < obj.params.length; i++) {
        if (i > 0) str += ', '
        str += obj.params[i]
      }
      str += ')'
      return str
    }
    return obj
  }
  return contract
}

function contractDeploy(abi, code, _arguments) {
  let contractObj = contract(abi, '0x')
  return contractObj.deploy({
    data: code,
    arguments: _arguments,
  })
}

async function txSignSend(tx) {
  await window.harmony.signTransaction(tx)
  let ret = await tx.sendTransaction()
  if (ret[1] != tx.id) throw { message: ret[1] }
  return tx
}

export default {
  hmySDK,
  login,
  logout,
  transfer,
  delegate,
  undelegate,
  withdrawReward,
  txSignSend,
  contract,
  contractDeploy,
}
