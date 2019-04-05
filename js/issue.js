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

const generatePayment = (mnemonic, NET) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const xprv = bitcoin.bip32.fromSeed(seed, NET);
  const p2pkh = bitcoin.payments.p2pkh({ pubkey: xprv.publicKey, network: NET });
  const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: xprv.publicKey, network: NET });
  const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: NET });
  return p2pkh;
}

const generateKeypair = (mnemonic, NET) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const xprv = bitcoin.bip32.fromSeed(seed, NET);
  const privateKey = xprv.derive(0).privateKey;
  const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, { network: NET });
  return keyPair;
}

const getAddress = async (mnemonic) => {
  const payment = generatePayment(mnemonic, TESTNET);
  document.getElementById('address').textContent = payment.address;
  document.getElementById('address').value = payment.address;
  const balance = await getBalance(payment.address);
  document.getElementById('balance').textContent = balance;
  document.getElementById('balance').value = balance;
}

function doRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        const json = JSON.parse(body);
        resolve(json);
      } else {
        reject(error);
      }
    });
  });
}

const getBalance = async (address) => {
  const URL = `https://chain.so/api/v2/get_tx_unspent/BTCTEST/${address}`;
  const requestOptions = {
    url: URL,
    method: 'GET'
  }
  const json = await doRequest(requestOptions);
  json.data.txs = json.data.txs.map((tx) => {tx.value=Math.floor(100000000*tx.value); return tx});
  let balance = json.data.txs.reduce((a, b) => a+b.value, 0);
  return balance;
}

const createTx = async (mnemonic, address, digest, balance) => {
  const fee = 1000;
  const txb = new bitcoin.TransactionBuilder(TESTNET);
  const payment = generatePayment(mnemonic, TESTNET);
  const keyPair = generateKeypair(mnemonic, TESTNET);
  // get utxo
  const URL = `https://chain.so/api/v2/get_tx_unspent/BTCTEST/${address}`;
  const requestOptions = {
    url: URL,
    method: 'GET'
  }
  const json = await doRequest(requestOptions);
  json.data.txs = json.data.txs.map((tx) => {tx.value=Math.floor(100000000*tx.value); return tx});
  // OP_RETURNの後ろにpdfのハッシュ値をくっ付けてる
  const data = Buffer.from(digest, 'hex');
  const certificateOutput = bitcoin.payments.embed({ data: [data] }).output;
  // add Input
  for(let utxo of json.data.txs) {
    // p2pkh用のInput
    txb.addInput(utxo.txid, utxo.output_no);
    // p2wpkh用のInput
    // txb.addInput(utxo.txid, utxo.output_no, null, payment.output);
  }
  // add Output
  txb.addOutput(certificateOutput, 0); // pdfのハッシュ値を載せたOP_RETURN用のoutput
  txb.addOutput(address, balance - fee); // 残高をまた自分のアドレスに返却
  // sign
  for(let i in json.data.txs) {
    // p2pkh用の署名
    txb.sign(+i, keyPair);
    // p2wpkh用の署名
    // txb.sign(+i, keyPair, null, null, json.data.txs[i].value);
  }
  // build
  const tx = txb.build();
  document.getElementById('rawTx').textContent = tx.toHex();
  document.getElementById('rawTx').value = tx.toHex();
  document.getElementById('txId').textContent = tx.getId();
  document.getElementById('txId').value = tx.getId();
}

const broadcastTx = (rawTx) => {
  const URL = 'https://chain.so/api/v2/send_tx/BTCTEST';
  const requestOptions = {
    url: URL,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    json: {
      'tx_hex': rawTx
    }
  }
  // const json = await doRequest(requestOptions);
  document.getElementById('tx_id').textContent = json.txid;
}

window.makeDigest = makeDigest;
window.getAddress = getAddress;
window.createTx = createTx;
window.broadcastTx = broadcastTx;
