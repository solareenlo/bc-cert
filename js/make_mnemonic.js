const bip39 = require('bip39');

// Macのターミナルでentropyを生成する方法
// $ cat /dev/urandom |LC_ALL=C tr -dc 'a-f0-9' | fold -w 64 | head -n 1
// ubuntuのコンソールでentropyを生成する方法
// $ cat /dev/urandom |tr -dc a-f0-9|head -c${1:-64}
if (process.argv.length != 3) {
  console.log('エントロピーを入力して下さい');
  process.exit(1);
}

const entropy = process.argv[2];
console.log(entropy);

const mnemonic = bip39.entropyToMnemonic(entropy);
console.log(mnemonic);
