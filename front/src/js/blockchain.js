const tbn = (x) => new BigNumber(x);
const tw = (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue();
const twBtc = (x) => BigNumber.isBigNumber(x) ? x.times(1e8).integerValue() : tbn(x).times(1e8).integerValue();
const fw = (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber();
const ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];

window.web3 =  new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/1u84gV2YFYHHTTnh8uVl')
);

async function get(instance, method, parameters) {
    return await instance.methods[method](...parameters).call();
}

async function sendToken(tokenAddress, privateKey, receiver, amount) {
    const instance = getInstance(ABI, tokenAddress);
    return set(instance, "transfer", privateKey, 0, [receiver, amount]);
}

async function sendSigned(rawTransations, isContractCreation) {
    if (typeof rawTransations != 'object')
        rawTransations = [rawTransations];

    const results = [];

    for (let i = 0; i < rawTransations.length; i++) {
        const transactionHash = await webSocketSend(rawTransations[i], isContractCreation);
        results.push(transactionHash);
    }
    return results;
}

function webSocketSend(rawTransations, isContractCreation = false) {
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTransations)
            .on('transactionHash', (transactionHash) => {
                if (!isContractCreation)
                    resolve(transactionHash);
            })
            .on('receipt', (receipt) => {
                console.log(receipt);
                if (isContractCreation)
                    resolve(receipt.contractAddress);
            })
            .on('error', (err) => {
                reject(err);
            });
    })
}

function estimateGas(instance, method, from, value, gasPrice, parameters) {
    return instance.methods[method](...parameters).estimateGas({from: from, gas: 9000000, value: value, gasPrice: gasPrice});
}

async function signTransaction(privateKey, to, value, data, gas = [], nonce) {
    const converted = toArrays(to, value, privateKey, data);
    const maxLength = converted.maxLength;
    const arrays = converted.arrays;
    const _receivers = arrays[0];
    const _values = arrays[1];
    const _privateKeys = arrays[2];

    if (isLengthError(maxLength, ...arrays))
        return new Error(`You have ${_receivers.length} receivers, ${_values.length} values and ${data.length} datas and ${_privateKeys.length} privateKeys. It should be equal.`);

    const addresses = _privateKeys.map(key => getAddress(key));

    const nonces = {};
    for (let i = 0; i < addresses.length; i++) {
        if (!nonces[addresses[i]]) {
            nonces[addresses[i]] = await web3.eth.getTransactionCount(addresses[i]);
            console.log(nonces[addresses[i]])
        }
    }

    const signedTX = [];

    for (let i = 0; i < _receivers.length; i++) {
        data = data === undefined ? [] : data[i];
        const txParam = {
            nonce: nonce ? nonce : nonces[addresses[i]],
            to: _receivers[i],
            value: _values[i],
            from: addresses[i],
            data: data,
            gasPrice: tbn(await window.web3.eth.getGasPrice()).times(1.5).integerValue().toNumber() ? tbn(await window.web3.eth.getGasPrice()).times(1.3).integerValue().toNumber() : 210000000*5,
            gas: gas[i] ? gas[i] : 21000
        };
        console.log(txParam)
        const tx = new ethereumjs.Tx(txParam);
        const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(_privateKeys[i].substring(2), 'hex');
        tx.sign(privateKeyBuffer);
        const serializedTx = tx.serialize();
        signedTX.push('0x' + serializedTx.toString('hex'));
        nonces[addresses[i]]++;

    }

    return signedTX;
}

async function set(instance, methodName, privateKey, value, parameters, nonce) {
    if (
        (!isArray(methodName) && isObject(methodName)) ||
        (!isArray(privateKey) && isObject(privateKey)) ||
        (!isArray(parameters) && isObject(parameters))
    ) {
        throw new Error('Parameters must have array or string type');
    }

    const converted = toArrays(instance, methodName, privateKey);
    const arrays = converted.arrays;
    const _instances = arrays[0];
    const _methodsNames = arrays[1];
    const _privateKeys = arrays[2];
    const gas = [];

    const data = [];
    for (let i = 0; i < _methodsNames.length; i++) {
        data.push(getCallData(_instances[i], _methodsNames[i], parameters));
        gas.push(await estimateGas(_instances[i], _methodsNames[i], getAddress(_privateKeys[i]), 0, await web3.eth.getGasPrice(), parameters));
    }

    const contracts = _instances.map(instance => instance._address);

    const signedTransactions = await signTransaction(_privateKeys, contracts, 0, data, gas, nonce);
    console.log(signedTransactions);

    return await sendSigned(signedTransactions);
}

function getCallData(instance, method, parameters) {
    return instance.methods[method](...parameters).encodeABI();
}

function getInstance(ABI, address) {
    return new web3.eth.Contract(ABI, address);
}

function getAddress(privateKey) {
    let _privateKey = privateKey.substring(2, privateKey.length);
    return keythereum.privateKeyToAddress(_privateKey);
}

function getPrivateKey() {
    let params = {
        keyBytes: 32,
        ivBytes: 16
    };
    let dk = keythereum.create(params);
    return "0x" + dk.privateKey.reduce((memo, i) => {
        return memo + ('0' + i.toString(16)).slice(-2);
    }, '');
}


class Blockchain {
    constructor() {
        this.getPrivateKey = getPrivateKey;
        this.getAddress = getAddress;
        this.set = set;
        this.signTransaction = signTransaction;
        this.sendSigned = sendSigned;
        this.getInstance = getInstance;
    }
}

const Network = (function () {
    return {
        init: (setting, currentNetwork) => {
            let network =  setting[currentNetwork];

            return {
                get () { return network },
            }
        }
    }
}());

const isArray = (variable) => variable instanceof Array;
const toArray = (variable, length) => Array.from({length: length}, (v, k) => variable);
const toArrays = (...variables) => {
    const lengths = variables.map(elem => isArray(elem) ? elem.length : 1);
    const maxLength = lengths.reduce((acc, val) => val > acc ? val : acc, 0);
    const arrays = variables.map(elem => isArray(elem) ? elem : toArray(elem, maxLength));
    return {
        maxLength: maxLength,
        arrays: arrays
    };
};
const isObject = (variable) => typeof variable == 'object';
const isLengthError = (length, ...arrays) => arrays.reduce((acc, array) => acc === false && array.length === length ? false : true, false);
const totalAmount = (amountArray) => amountArray.reduce((acc, val) => acc + val);
const dynamicSort = (property) => {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
};
const isTxComplete = (utxoAmount, necessaryAmount) => utxoAmount >= necessaryAmount ? tbn(utxoAmount).minus(necessaryAmount).toNumber() : false;

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return "0x" + hex;
}