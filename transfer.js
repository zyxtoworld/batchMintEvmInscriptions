require('dotenv').config();
const {readFileSync} = require('fs');
const {Web3} = require('web3');
const axios = require('axios');

const nodeUrl = process.env.NODE_URL;
const chainId = process.env.CHAIN_ID;

// 创建Web3实例
const web3 = new Web3(nodeUrl);

// 发送gas币的地址和私钥
const fromAddress = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

// 从json文件获取钱包信息
const wallets = JSON.parse(readFileSync('evm_wallets.json', 'utf-8'));

// 目标地址列表
const toAddresses = wallets.map(wallet => wallet.address);

// 转账金额（以wei为单位）
const amountInWei = web3.utils.toWei(process.env.MONEY, 'ether');

// 构建交易对象
const buildTransaction = async (to) => {
    try {
        // 获取实时Gas价格
        const gasPriceInWei = await getGasPrice();
        const nonce = await web3.eth.getTransactionCount(fromAddress);

        // 估算gas限制
        const gasLimit = await web3.eth.estimateGas({
            from: fromAddress,
            to: to,
            value: amountInWei,
        });

        return {
            from: fromAddress,
            to: to,
            value: amountInWei,
            gasPrice: gasPriceInWei,
            gas: gasLimit,
            nonce: nonce,
        };
    } catch (error) {
        throw new Error(`构建交易失败: ${error.message}`);
    }
};

// 获取实时Gas价格
const getGasPrice = async () => {
    try {
        const response = await axios.post(nodeUrl, {
            jsonrpc: '2.0',
            id: chainId,
            method: 'eth_gasPrice',
            params: [],
        });

        return response.data.result;
    } catch (error) {
        throw new Error(`获取Gas价格失败: ${error.message}`);
    }
};

// 发送交易
const sendTransaction = async (transaction) => {
    try {
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);
        return web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    } catch (error) {
        throw new Error(`发送交易失败: ${error.message}`);
    }
};

// 批量发送交易
const batchSendTransactions = async () => {
    for (const toAddress of toAddresses) {
        const transaction = await buildTransaction(toAddress);
        try {
            const receipt = await sendTransaction(transaction);
            console.log(`交易已发送至 ${toAddress}. 交易哈希: ${receipt.transactionHash}`);
        } catch (error) {
            console.error(`发送交易至 ${toAddress} 失败: ${error.message}`);
        }
    }
};

// 执行批量发送
batchSendTransactions();