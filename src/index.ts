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
// const masterNode = bip32.fromSeed(seed, bitcoin.networks.testnet);
const masterNode = bip32.fromSeed(seed);
let path = 'm/0/0';
let child = masterNode.derivePath(path);
const string = child.neutered().toBase58();

const getAddress = (node: bip32.BIP32, network: bitcoin.Network) => {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
}


const { address } = bitcoin.payments.p2sh({
  redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: bitcoin.networks.testnet }),
  network: bitcoin.networks.testnet
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

https.get(URL, (res) => {
  let data: Buffer[] = [];
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
