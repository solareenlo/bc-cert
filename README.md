# bc-cert
ビットコインのブロックチェーンに何かしらの証明書のハッシュ値を載せるためのツール群.  
**説明**: [scrapboxにある説明](https://scrapbox.io/solareenlo/ブロックチェーンエンジニア集中講座の修了証明書)

### Usage
```bash
git clone git@github.com:solareenlo/bc-cert.git
cd bc-cert
npm install か yarn
npm run bundle か yarn bundle
// for Mac
open dist/index.html
// for Ubuntu
xdg-open dist/index.html
```

### References
- [bitcoinjs/bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
- [bitcoinjs/bip32](https://github.com/bitcoinjs/bip32)
- [bitcoinjs/bip39](https://github.com/bitcoinjs/bip39)
- [JavaScriptでSHA256生成](https://scrapbox.io/solareenlo/JavaScriptでSHA256生成)
