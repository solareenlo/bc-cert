const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const https = require('https');
const request = require('request');
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

const makeAddress = async (mnemonic) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const xprv = bitcoin.bip32.fromSeed(seed, TESTNET);
  const p2pkh = bitcoin.payments.p2pkh({ pubkey: xprv.publicKey, network: TESTNET });
  const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: xprv.publicKey, network: TESTNET });
  const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: TESTNET });
  document.getElementById('address').textContent = p2pkh.address;
  const balance = await getBalance(p2pkh.address);
  document.getElementById('balance').textContent = balance;
}

function httpRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

const getBalance = async (address) => {
  let balance = 0;
  // const URL = `https://chain.so/api/v2/get_address_balance/BTCTEST/${address}`;
  const URL = `https://chain.so/api/v2/get_tx_unspent/BTCTEST/${address}`;
  const requestOptions = {
    url: URL,
    method: 'GET'
  }
  const body = await httpRequest(requestOptions);
  let json = JSON.parse(body);
  json.data.txs = json.data.txs.map((tx) => {tx.value=Math.floor(100000000*tx.value); return tx});
  balance = json.data.txs.reduce((a, b) => a+b.value, 0);
  /* この中では非同期処理でhttpリクエストを投げてる.
   * Nodejsは標準で非同期処理してくれる.
  await https.get(URL, (res) => {
    let data = [];
    res.on('data', (d) => {
      data.push(d);
    }).on('end', () => {
      console.log('balance0: ', balance);
      const json = JSON.parse(Buffer.concat(data).toString());
      json.data.txs = json.data.txs.map((tx) => {tx.value=Math.floor(100000000*tx.value); return tx});
      balance = json.data.txs.reduce((a, b) => a+b.value, 0);
      console.log('balance1: ', balance);
      return balance;
    });
  }).on('error', (e) => {
    console.error(e);
  });
  */
      return balance;
}

const broadcastTx = (mnemonic, digest) => {
  document.getElementById('txId').textContent = 'testtesttest';
}

window.makeDigest = makeDigest;
window.makeAddress = makeAddress;
window.broadcastTx = broadcastTx;
