const {BlockChain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('4bca49af9c6c0b0fa45e39bedd3042b04884349ec3903d6b59b05d911618af61');
const myWalletAddress = myKey.getPublic('hex');

let skCoin = new BlockChain();

const Tx1 = new Transaction(myWalletAddress, 'public-key-of-receiver', 10);
Tx1.signTransaction(myKey);
skCoin.addTransaction(Tx1);
//address1 , address2 are actually public key of wallet address

//console.log(skCoin.pendingTransactions);
console.log("\nStarting the miner.....");
skCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of Suman: ', skCoin.getBalancedAddress(myWalletAddress));

console.log('Is chain valid ? ', skCoin.isChainValid());