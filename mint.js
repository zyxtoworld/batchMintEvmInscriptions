require('dotenv').config();
const {Web3} = require('web3');
const fs = require('fs');

async function performTransaction(walletInfo, numberOfTimes) {
    const web3 = new Web3(process.env.NODE_URL); // 节点URL

    for (let i = 0; i < numberOfTimes; i++) {
        try {
            const nonce = await web3.eth.getTransactionCount(walletInfo.address);
            const amount = web3.utils.toWei('0', 'ether'); // 期望交易金额，单位为wei
            const mintStr = process.env.MINT_STR;
            // 将字符串转换为UTF-8编码的字节
            const utf8Bytes = Buffer.from(mintStr, 'utf-8');
            // 将字节转换为十六进制表示的字符串
            const hexStr = '0x' + utf8Bytes.toString('hex');
            const gasPrice = await web3.eth.getGasPrice();
            const gasEstimate = await web3.eth.estimateGas({
                to: walletInfo.address,
                value: amount,
                data: hexStr,
            });

            const transaction = {
                to: walletInfo.address,
                value: amount,
                gasPrice: gasPrice,
                nonce: nonce,
                gas: gasEstimate,
                data: hexStr,
            };

            const signedTransaction = await web3.eth.accounts.signTransaction(transaction, walletInfo.privateKey);
            const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            console.log(`第 ${walletInfo.num} 个地址 ${walletInfo.address} 第 ${i + 1} 次操作成功，交易哈希: ${result.transactionHash}`);
        } catch (error) {
            console.error(`第 ${walletInfo.num} 个地址 ${walletInfo.address} 第 ${i + 1} 次操作失败: `, error);
        }
    }
}

async function main() {
    let walletData = [];
    try {
        walletData = JSON.parse(fs.readFileSync('evm_wallets.json', 'utf-8'));
    } catch (e) {
        console.log('未找到 evm_wallets.json 文件');
    }

    Promise.all(walletData.map(wallet => performTransaction(wallet, process.env.NUMBER_OF_TIMES)))
        .then(() => {
            console.log("所有操作完成");
        })
        .catch(error => {
            console.error("操作中有错误发生: ", error);
        });
}

main();