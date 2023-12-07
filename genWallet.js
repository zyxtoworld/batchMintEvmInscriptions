require('dotenv').config();
const fs = require('fs');
const bip39 = require('bip39')
const HDWallet = require('ethereum-hdwallet');
// 获取助记词
const mnemonic = process.env.MNEMONIC;
// 需要生成的地址数
const genNum = process.env.GEN_NUM;
 
async function getAddress(mnemonic) {
 
	const seed = await bip39.mnemonicToSeed(mnemonic); //生成种子
 
	const hdwallet = HDWallet.fromSeed(seed);

	const addresses = [];

	for (var i = 0; i < genNum; i++) { // 用同一个种子生成多个地址
 
		console.log('=============地址' + (i + 1) + '=================')
 
		const key = hdwallet.derive("m/44'/60'/0'/0/" + i); // 地址路径的最后一位设置为循环变量

		const address = '0x' + key.getAddress().toString('hex'); //地址
		const privateKey = key.getPrivateKey().toString('hex');
		const publicKey = key.getPublicKey().toString('hex');

		const addressInfo = {
			num: i + 1,
			address: address,
			privateKey: privateKey,
			publicKey: publicKey
		};

		addresses.push(addressInfo);

		console.log("地址 = " + address); // 地址
		console.log("私钥 = " + privateKey); // 私钥
		console.log("公钥 = " + publicKey); // 公钥
	}
	// 将地址信息写入 JSON 文件
	fs.writeFileSync('evm_wallets.json', JSON.stringify(addresses, null, 2));
}
 
getAddress(mnemonic); //执行函数