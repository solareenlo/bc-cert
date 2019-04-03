const bitcoin = require('bitcoinjs-lib');
const https = require('https');
const wif = require('wif');

const TESTNET = bitcoin.networks.testnet;

const getDigest = (fileBuffeArrray) => bitcoin.crypto.sha256(Buffer(fileBuffeArrray)).toString('hex');

const makeAddress = (wif) => {
  const keyPair = bitcoin.ECPair.fromWIF(wif);
  const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: TESTNET });
  document.getElementById("address").textContent = address;
}

window.getDigest = getDigest;
window.makeAddress = makeAddress;
