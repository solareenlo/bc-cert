import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import bitcoin from 'bitcoinjs-lib';
import https from 'https';

// ターミナルでentropyを生成する方法
// $ cat /dev/urandom |tr -dc a-f0-9|head -c${1:-64}
const entropy = '7d1a295c63775a1d6ab11d0990cf1fd1e3ef33864d599a6f91d1e61e2c431ecb';
const mnemonic = bip39.entropyToMnemonic(entropy);
const seed = bip39.mnemonicToSeed(mnemonic);
const node = bip32.fromSeed(seed);
// const keyPair = bitcoin.ECPair.makeRandom({ network: bitcoin.networks.testnet });
const p2pkh = bitcoin.payments.p2pkh({ pubkey: node.publicKey, network: bitcoin.networks.testnet });

const txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
const data = Buffer.from('pdf-hash', 'utf8');
const embed = bitcoin.payments.embed({ data: [data] });
// txb.addInput(unspent.txId, unspent.vout);
// txb.addOutput(embed.output, 1000);
// txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e5);
// txb.sign(0, keyPair);

// build and broadcast to the RegTest network
// regtestUtils.broadcast(txb.build().toHex(), done)
