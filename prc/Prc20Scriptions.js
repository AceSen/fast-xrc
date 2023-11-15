
const ethers = require('ethers');
const config = require('./Config.json');
const DateUtils = require('../utils/DateUtils');


const provider = config.providerUrl ? new ethers.JsonRpcProvider(config.providerUrl) : ethers.getDefaultProvider();


// "gasPrice": 363371165220,

async function scription() { 

    const wallet = new ethers.Wallet(config.privateKey, provider);
    const address = await wallet.getAddress();
    let nonce = await wallet.getNonce();
    console.log(`地址: ${address}`)
    
    for (let i = 1; i <= config.num; i++) {
        let calldata = "data:,"
        let content = {
            "p": "prc-20",
            "op": "mint",
            "tick": config.tick + "",
            "amt": config.amt + ""
        }
        calldata += JSON.stringify(content);
        let calldataCode = ethers.hexlify(ethers.toUtf8Bytes(calldata));
        let tx = {
            to: address,
            value: 0,
            data: calldataCode
        }
        
        tx.nonce = nonce;
        if (config.gasPrice && config.gasPrice > 0) {
            tx.gasPrice = config.gasPrice;
        }
        
        console.log(`第${i}次铸造......   nonce: ${nonce}`)
        wallet.sendTransaction(tx).then(res => {
            console.log(`第${i}次铸造,返回值: ${res.hash}`)
            // console.dir(res)
            // 铸造成功
            // console.log(`铸造成功, txHash: ${res.hash}`)

        }).catch(err => {
            console.log(`第${i}次铸造,发生错误: ${err} `)
            console.dir(err)
        });

            
        ++nonce;
        await DateUtils.sleep(2000);
    }
    
}

scription();