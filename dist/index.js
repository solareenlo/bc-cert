"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bip39 = __importStar(require("bip39"));
const bip32 = __importStar(require("bip32"));
const bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
const https_1 = __importDefault(require("https"));
// import dhttp from 'dhttp/200';
// const mnemonic = bip39.generateMnemonic(256);
// ターミナルでentropyを生成する方法
// $ cat /dev/urandom |tr -dc a-f0-9|head -c${1:-64}
const entropy = '7d1a295c63775a1d6ab11d0990cf1fd1e3ef33864d599a6f91d1e61e2c431ecb';
const mnemonic = bip39.entropyToMnemonic(entropy);
const seed = bip39.mnemonicToSeed(mnemonic);
// const masterNode = bip32.fromSeed(seed, bitcoin.networks.testnet);
const masterNode = bip32.fromSeed(seed);
let path = 'm/0/0';
let child = masterNode.derivePath(path);
const string = child.neutered().toBase58();
const getAddress = (node, network) => {
    return bitcoinjs_lib_1.default.payments.p2pkh({ pubkey: node.publicKey, network }).address;
};
const { address } = bitcoinjs_lib_1.default.payments.p2sh({
    redeem: bitcoinjs_lib_1.default.payments.p2wpkh({ pubkey: child.publicKey, network: bitcoinjs_lib_1.default.networks.testnet }),
    network: bitcoinjs_lib_1.default.networks.testnet
});
console.log(address);
// main net 用
// const URL = `https://blockchain.info/rawaddr/${address}`;
// test net 用
// const URL = `https://chain.so/api/v2/get_address_received/BTCTEST/${address}`;
const txid = `64a113656256d2220a373d0b18d9a315668260365983cb600f96229e708cfe6c`;
// const txid = '82a0c171b7a609e5212393073ddee7305ae94622fe7d315f3ebff2b9a78ba88d';
const URL = `https://chain.so/api/v2/get_tx_outputs/BTC/${txid}`;
// const URL = `https://chain.so/api/v2/get_confidence/BTC/${txid}`;
// const URL = `https://chain.so/api/v2/get_tx_inputs/BTC/${txid}`;
console.log(URL);
https_1.default.get(URL, (res) => {
    let data = [];
    res.on('data', (d) => {
        data.push(d);
    }).on('end', () => {
        const json = JSON.parse(Buffer.concat(data).toString());
        console.log(json.data.outputs[0].script);
        console.log(json.data.outputs);
    });
}).on('error', (e) => {
    console.error(e);
});
