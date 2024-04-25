import loadWeb3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

let provider = new HDWalletProvider({
	mnemonic: {
		phrase: process.env.WALLET_SEED
	},
	providerOrUrl: process.env.EL_ENDPOINT,
	chainId: process.env.CHAIN_ID
});
const web3 = new loadWeb3(provider);

const accounts = await web3.eth.getAccounts();
console.log(accounts);

const numKeyperSetsData = web3.eth.abi.encodeFunctionCall({
    "inputs": [],
    "name": "getNumKeyperSets",
    "outputs": [
      {
	"name": "",
	"type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
});

const slotActivationData = web3.eth.abi.encodeFunctionCall({
    "inputs": [
      {
	"name": "index",
	"type": "uint64"
      }
    ],
    "name": "getKeyperSetActivationBlock",
    "outputs": [
      {
	"name": "",
	"type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
}, [1]);

const keyperAddressData = web3.eth.abi.encodeFunctionCall({
    "inputs": [
      {
	"name": "index",
	"type": "uint64"
      }
    ],
    "name": "getKeyperSetAddress",
    "outputs": [
      {
	"name": "",
	"type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
}, [1]);

const slotIndexData = web3.eth.abi.encodeFunctionCall({
    "inputs": [
      {
	"internalType": "uint64",
	"name": "block",
	"type": "uint64"
      }
    ],
    "name": "getKeyperSetIndexByBlock",
    "outputs": [
      {
	"components": [
	  {
	    "internaltype": "address",
	    "name": "",
	    "type": "address"
	  },
	  {
	    "internaltype": "uint64",
	    "name": "",
	    "type": "uint64"
	  }
	],
	"name": "",
	"type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
}, [9486808]);

const receipt1 = await web3.eth.call({
	from: process.env.WALLET_ADDRESS,
	to: process.env.KEYPER_SET_MANAGER_ADDRESS,
	data: numKeyperSetsData,
	chain: 'chiado',
});
console.log(receipt1);

const receipt2 = await web3.eth.call({
	from: process.env.WALLET_ADDRESS,
	to: process.env.KEYPER_SET_MANAGER_ADDRESS,
	data: slotIndexData,
	chain: 'chiado',
});
console.log(receipt2);

const receipt3 = await web3.eth.call({
	from: process.env.WALLET_ADDRESS,
	to: process.env.KEYPER_SET_MANAGER_ADDRESS,
	data: slotActivationData,
	chain: 'chiado',
});
console.log(receipt3);

const receipt4 = await web3.eth.call({
	from: process.env.WALLET_ADDRESS,
	to: process.env.KEYPER_SET_MANAGER_ADDRESS,
	data: keyperAddressData,
	chain: 'chiado',
});
console.log(receipt4);

provider.engine.stop();
