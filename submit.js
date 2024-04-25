import loadWeb3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import fs from "fs";

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

const registrationMessages = JSON.parse(fs.readFileSync('validatorRegistrations.json'));

for (const validatorIndex in registrationMessages) {
	const registrationMessage = registrationMessages[validatorIndex];
	console.log(validatorIndex + " : (" + registrationMessage.message + ", " + registrationMessage.signature + ")");
	const data = web3.eth.abi.encodeFunctionCall({
	    "inputs": [
	      {
		"name": "message",
		"type": "bytes",
		"internalType": "Uint8Array"
	      },
	      {
		"name": "signature",
		"type": "bytes",
		"internalType": "Uint8Array"
	      }
	    ],
	    "name": "update",
	    "type": "function"
	}, [
		web3.utils.hexToBytes(registrationMessage.message),
		web3.utils.hexToBytes(registrationMessage.signature)
	]);

	// send transaction
	const receipt = await web3.eth.sendTransaction({
		from: process.env.WALLET_ADDRESS,
		to: process.env.VALIDATOR_REGISTRY_ADDRESS,
		data: data,
		chain: 'chiado',
	});

	console.log(receipt);
}

provider.engine.stop();
