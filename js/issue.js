const bitcoin = require('bitcoinjs-lib');
const https = require('https');
const wif = require('wif');

const getDigest = (fileBuffeArrray) => bitcoin.crypto.sha256(Buffer(fileBuffeArrray)).toString('hex');

window.getDigest = getDigest;
