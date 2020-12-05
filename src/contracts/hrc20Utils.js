import * as hmy from '../explorer/hmy';

const {hmySDK} = hmy.default;
import HRC20_ABI from '../explorer/HRC20_ABI.json';

const contract = hmySDK.contracts.createContract(HRC20_ABI);
const contractWithHelpers = hmy.default.contract(HRC20_ABI);
const options = {gasPrice: 1000000000, gasLimit: 6721900};

const hrc20Events = ['Transfer', 'Approval']
const eventsSignatures = hrc20Events.map(e => contract.abiModel.getEvent(e).signature);
const hrc20Methods = ['balanceOf', 'totalSupply', 'transfer', 'name', 'symbol', 'decimals']
const methodsSignatures = hrc20Methods.map(e => contract.abiModel.getMethod(e).signature);
const signatures = [...eventsSignatures, ...methodsSignatures].map(e => e.startsWith('0x') ? e.slice(2) : e);

const hasAllSignatures = hexData => signatures.reduce((acc, s) => hexData.indexOf(s) !== -1 && acc, true);

export const isContractTx = tx => {
  return tx.input && tx.input !== '0x';
};

export const isHrc20Deploy = tx => {
  if (!isContractTx(tx)) {
    return false;
  }

  return hasAllSignatures(tx.input);
};

export const getTxHrc20Method = tx => {
  const hexData = tx.input;

  if (!hexData) {
    return false;
  }

  const no0x = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
  const sig = no0x.slice(0, 8).toLowerCase();
  const method = contractWithHelpers.abiModel.getMethod('0x' + sig);

  if (!method) {
    return false;
  }

  const inputValues = contractWithHelpers.decodeInput(hexData);
  const outputValues = method.decodeOutputs(hexData);

  const inputs = method.inputs.map((o, i) => ({name: o.name, type: o.type, value: inputValues.params[i]}))
  const outputs = method.outputs.map((o, i) => ({name: o.name, type: o.type, value: outputValues[i]}))

  return {method, inputs, outputs};
};

export const getHrc20ContractProps = async (contractAddress) => {
  try {
    const contract = hmySDK.contracts.createContract(HRC20_ABI, contractAddress);

    const name = await contract.methods.name().call(options);
    const decimalsHex = await contract.methods.decimals().call(options);
    const decimals = parseInt(decimalsHex, 16);

    const totalSupply = (await contract.methods.totalSupply().call(options)).toString();
    const symbol = (await contract.methods.symbol().call(options));

    if (!name || !symbol || !totalSupply || !decimals) {
      return null;
    }

    return {contractAddress, totalSupply, name, decimals, symbol};
  } catch (err) {
    return null;
  }
};