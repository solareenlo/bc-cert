const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const https = require('https');
const wif = require('wif');

// Macのターミナルでentropyを生成する方法
// $ cat /dev/urandom |LC_ALL=C tr -dc 'a-f0-9' | fold -w 64 | head -n 1
// ubuntuのコンソールでentropyを生成する方法
// $ cat /dev/urandom |tr -dc a-f0-9|head -c${1:-64}
const entropy = '7d1a295c63775a1d6ab11d0990cf1fd1e3ef33864d599a6f91d1e61e2c431ecb';
console.log('entropy: ', entropy);
const mnemonic = bip39.entropyToMnemonic(entropy);
console.log('mnemonic: ', mnemonic);
const seed = bip39.mnemonicToSeed(mnemonic);
console.log('seed: ', seed.toString('hex'));
const node = bip32.fromSeed(seed);
console.log('node: ', node);
const wif = node.toWIF();
console.log('wif: ', wif);
const keyPair = bitcoin.ECPair.fromWIF(wif);
console.log('keyPair: ', keyPair);
const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: bitcoin.networks.testnet });
console.log('p2wpkh: ', p2wpkh);
console.log('Address: ', p2wpkh.address);
console.log('Input: ', p2wpkh.input);
const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: bitcoin.networks.testnet });
console.log('Address: ', p2sh.address);

const txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
console.log('txb: ', txb);
const data = Buffer.from('pdf-hash', 'utf8');
const embed = bitcoin.payments.embed({ data: [data] });
console.log('embed: ', embed);
// txb.addInput(unspent.txId, unspent.vout);
// txb.addOutput(embed.output, 1000);
// txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e5);
// txb.sign(0, node);

// build and broadcast to the RegTest network
// regtestUtils.broadcast(txb.build().toHex(), done)
