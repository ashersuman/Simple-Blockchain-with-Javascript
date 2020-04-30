const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previoushash='')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash()
    {
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: "+ this.hash);
    }
}

class BlockChain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    //first block in the blockchain must be added manually and it is called Genesis block.
    createGenesisBlock(){
        return new Block("16/04/2020", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    // <OLD MINING METHOD>
    // addBlock(newBlock){
    //     newBlock.previoushash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    
    // <NEW MINING METHOD>
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalancedAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previoushash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let skCoin = new BlockChain();

skCoin.createTransaction(new Transaction('address1', 'address2', 100));
skCoin.createTransaction(new Transaction('address2', 'address1', 50));
//address1 , address2 are actually public key of wallet address

//console.log(skCoin.pendingTransactions);
console.log("\nStarting the miner.....");
skCoin.minePendingTransactions('xploit-address');

//console.log(skCoin.pendingTransactions);
console.log("\nStarting the miner again.....");
skCoin.minePendingTransactions('kemon-address');
console.log('\nBalance of Xploit is', skCoin.getBalancedAddress('xploit-address'));