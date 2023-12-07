require('dotenv').config();
const fs = require('fs');
const bip39 = require('bip39')
// 获取助记词
const mnemonic = process.env.MNEMONIC;
// 需要生成的地址数
const genNum = process.env.GEN_NUM;
// 生成英文助记词
const mnemonicEn = bip39.generateMnemonic()
// 生成中文助记词
const mnemonicCn = bip39.generateMnemonic(128, null, bip39.wordlists.chinese_simplified);
console.log('英文助记词：' + mnemonicEn);
console.log('中文助记词：' + mnemonicCn);
const mnemonicInfo = {
	英文助记词: mnemonicEn,
	中文助记词: mnemonicCn
};
// 将助记词写入 JSON 文件
fs.writeFileSync('mnemonic.json', JSON.stringify(mnemonicInfo, null, 2));