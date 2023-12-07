# 批量 mint EVM全链铭文脚本

## 安装
### 安装 nodejs

https://nodejs.org/en/download/

### 安装 yarn
先进入到根目录再执行
```
npm install -g yarn
```
```
yarn install
```

## 配置环境变量
修改 .env 文件，并填写所有信息

## 生成助记词
```
node genMnemonic.js
```
生成助记词会保存在 mnemonic.json 文件中

## 根据助记词批量打印地址
```
node printAllAddressByMnemonic.js
```

## 根据助记词批量打印私钥
```
node printAllPrivateKeyByMnemonic.js
```

## 钱包批量生成
钱包批量生成所依据的助记词是在 .env 文件中配置的，如果想使用代码生成的助记词，请在 mnemonic.json 文件中找到并配置到 .env 文件中。
```
node genWallet.js
```
生成的信息会保存在 evm_wallets.json 文件中

## 批量转账
给 evm_wallets.json 文件里的所有地址转账，如果不想用生成的地址，就按格式修改成你要转账的地址，只需改 evm_wallets.json 文件中的 address 就可以

```
node transfer.js
```

## 批量mint
用 evm_wallets.json 里的所有地址来mint，可按格式自行添加和修改，文件里的 address 和 privateKey 必须配置正确
```
node mint.js
```
