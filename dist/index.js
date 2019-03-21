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
const masterNode = bip32.fromSeed(seed);
let path = 'm/0/0';
let child = masterNode.derivePath(path);
const string = child.neutered().toBase58();
console.log(child.publicKey);
//  const getAddress = (node, network: bitcoin.Network) => {
//    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
//  }
const keyPair = bitcoinjs_lib_1.default.ECPair.makeRandom();
const { address } = bitcoinjs_lib_1.default.payments.p2pkh({ pubkey: keyPair.publicKey });
console.log(address);
const URL = `https://blockchain.info/rawaddr/${address}`;
https_1.default.get(URL, (res) => {
    let body = '';
    res.on('data', (d) => {
        body += d;
        console.log(JSON.parse(body));
    });
}).on('error', (e) => {
    console.error(e);
});
