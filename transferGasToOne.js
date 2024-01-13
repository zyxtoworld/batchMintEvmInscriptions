require('dotenv').config();
const {readFileSync} = require('fs');
const {Web3} = require('web3');

const nodeUrl = process.env.NODE_URL;

// 创建Web3实例
const web3 = new Web3(nodeUrl);

// 从json文件获取钱包信息
const wallets = JSON.parse(readFileSync('evm_wallets.json', 'utf-8'));

// 目标地址
const toAddress = process.env.ADDRESS

// 构建交易对象
const buildTransaction = async (wallet) => {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(wallet.address);
        // 余额（以wei为单位）
        const amountInWei = await web3.eth.getBalance(wallet.address);
        // 估算gas限制
        const gasLimit = await web3.eth.estimateGas({
            from: wallet.address,
            to: toAddress,
            value: amountInWei,
        });

        return {
            from: wallet.address,
            to: toAddress,
            value: amountInWei - gasLimit * gasPrice,
            gas: gasLimit,
            nonce: nonce,
            gasPrice: gasPrice
        };
    } catch (error) {
        throw new Error(`构建交易失败: ${error.message}`);
    }
};

// 发送交易
const sendTransaction = async (transaction, wallet) => {
    try {
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, wallet.privateKey);
        return web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    } catch (error) {
        throw new Error(`发送交易失败: ${error.message}`);
    }
};

// gas币余额归集
const batchSendTransactions = async () => {
    const transactionPromises = wallets.map(async (wallet) => {
        try {
            const transaction = await buildTransaction(wallet);
            const receipt = await sendTransaction(transaction, wallet);
            console.log(`第 ${wallet.num} 个地址 ${wallet.address} 转账至 ${toAddress} 成功。交易哈希: ${receipt.transactionHash}`);
        } catch (error) {
            console.error(`第 ${wallet.num} 个地址 ${wallet.address} 转账至 ${toAddress} 失败: ${error.message}`);
        }
    });

    await Promise.all(transactionPromises);
};

// 执行批量发送
batchSendTransactions();