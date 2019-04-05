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
  const p2pkh = bitcoin.payments.p2pkh({ pubkey: xprv.publicKey, network: TESTNET });
  const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: xprv.publicKey, network: TESTNET });
  const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: TESTNET });
  document.getElementById('address').textContent = p2pkh.address;
  getBalance(p2pkh.address);
}

const getBalance = (address) => {
  // const URL = `https://chain.so/api/v2/get_address_balance/BTCTEST/${address}`;
  const URL = `https://chain.so/api/v2/get_tx_unspent/BTCTEST/${address}`;
  let balance;
  https.get(URL, (res) => {
    let data = [];
    res.on('data', (d) => {
      data.push(d);
    }).on('end', () => {
      const json = JSON.parse(Buffer.concat(data).toString());
      json.data.txs = json.data.txs.map((tx) => {tx.value=Math.floor(100000000*tx.value); return tx});
      balance = json.data.txs.reduce((a, b) => a+b.value, 0);
      document.getElementById('balance').textContent = balance;
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

const broadcastTx = (mnemonic, digest) => {
  document.getElementById('txId').textContent = 'testtesttest';
}

window.makeDigest = makeDigest;
window.makeAddress = makeAddress;
window.broadcastTx = broadcastTx;
