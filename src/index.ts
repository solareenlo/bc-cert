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
// const txid = `64a113656256d2220a373d0b18d9a315668260365983cb600f96229e708cfe6c`;
const txid = '82a0c171b7a609e5212393073ddee7305ae94622fe7d315f3ebff2b9a78ba88d';
// const URL = `https://chain.so/api/v2/get_tx_outputs/BTC/${txid}`;
// const URL = 'https://chain.so/api/v2/get_confidence/DOGE/6f47f0b2e1ec762698a9b62fa23b98881b03d052c9d8cb1d16bb0b04eb3b7c5b';
const URL = 'https://chain.so/api/v2/get_tx_inputs/DOGE/6f47f0b2e1ec762698a9b62fa23b98881b03d052c9d8cb1d16bb0b04eb3b7c5b/0';
console.log(URL);

https.get(URL, (res) => {
  let body = {
    "status" : "success",
    "data" : {
      "txid" : "6f47f0b2e1ec762698a9b62fa23b98881b03d052c9d8cb1d16bb0b04eb3b7c5b",
      "network" : "DOGE",
      "inputs" : {
        "input_no" : 0,
        "value" : "1133.15453258",
        "address" : "DM7Yo7YqPtgMsGgphX9RAZFXFhu6Kd6JTT",
        "type" : "pubkeyhash",
        "script" : "3045022100c25659a2e7f5d5f5347527282fff2e5f8492565acc972cf861a301be4062dbdc022003871c880d38115e3f3b4fb7eda478f5b25dba3e698e8e9c9eff5a03ecacc4a601 02d3d9fc27d80b5e6437bc40f0544e7968a3b720196834ebb14ec932b20b59aba7",
        "witness" : null,
        "from_output" : {
          "txid" : "d300f96eb28f43113e219b76bc167ca94ec77071871b114533b2882b7fceea9d",
          "output_no" : 1
        }
      }
    }
  };
  res.on('data', (d) => {
    console.log(d);
    JSON.parse(d, (key, value) => {
      console.log(`${key}: ${value}`);
    });
    console.log(JSON.parse(d));
    console.log(JSON.parse(JSON.stringify(body)));
    JSON.parse(JSON.stringify(body), (key, value) => {
      console.log(`${key}: ${value}`);
    });
  })
}).on('error', (e) => {
  console.error(e);
});
