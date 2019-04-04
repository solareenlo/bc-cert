const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const https = require('https');
const wif = require('wif');

const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;

const getDigest = (fileBuffeArrray) => bitcoin.crypto.sha256(Buffer(fileBuffeArrray)).toString('hex');

const makeDigest = (evt) => {
  document.getElementById('digest').value = '';
  const files = evt.target.files[0];
  const reader = new FileReader();
  reader.onload = (function(){
    return function(e){
      document.getElementById('digest').value = getDigest(e.target.result);
      document.getElementById('digest').textContent = getDigest(e.target.result);
    }
  })(files);
  reader.readAsArrayBuffer(files);
}

const makeAddress = (mnemonic) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const xprv = bitcoin.bip32.fromSeed(seed, TESTNET);
  const { address } = bitcoin.payments.p2wpkh({ pubkey: xprv.publicKey, network: TESTNET });
  document.getElementById('address').textContent = address;
}

const broadcastTx = (mnemonic, digest) => {
  document.getElementById('txId').textContent = 'testtesttest';
}

window.makeDigest = makeDigest;
window.makeAddress = makeAddress;
window.broadcastTx = broadcastTx;
