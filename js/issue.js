const bitcoin = require('bitcoinjs-lib');
const https = require('https');
const wif = require('wif');

const TESTNET = bitcoin.networks.testnet;

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

const makeAddress = (wif) => {
  const keyPair = bitcoin.ECPair.fromWIF(wif);
  const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: TESTNET });
  document.getElementById("address").textContent = address;
}

window.getDigest = getDigest;
window.makeDigest = makeDigest;
window.makeAddress = makeAddress;
