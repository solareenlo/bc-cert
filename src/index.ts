import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import bitcoin from 'bitcoinjs-lib';
import https from 'https';
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

const getAddress = (node: Buffer, network: bitcoin.Network) => {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
}

const keyPair = bitcoin.ECPair.makeRandom();
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey});
console.log(address);

const URL = `https://blockchain.info/rawaddr/${address}`;

https.get(URL, (res) => {
  let body = '';
  res.on('data', (d) => {
    body += d;
    console.log(JSON.parse(body));
  });
}).on('error', (e) => {
  console.error(e);
});
