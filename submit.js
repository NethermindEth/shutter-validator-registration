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

const signedRegistrations = JSON.parse(fs.readFileSync('signedRegistrations.json'));
var startIndex = 0;
if (process.argv.length > 2)
{
	startIndex = parseInt(process.argv[2]);
}

for (const validatorIndex in signedRegistrations) {
	if (validatorIndex < startIndex)
	{
		continue;
	}

	const signedRegistration = signedRegistrations[validatorIndex];
	console.log(validatorIndex + " : (" + signedRegistration.message + ", " + signedRegistration.signature + ")");
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
		web3.utils.hexToBytes(signedRegistration.message),
		web3.utils.hexToBytes(signedRegistration.signature)
	]);

	// send transaction
	const receipt = await web3.eth.sendTransaction({
		from: process.env.WALLET_ADDRESS,
		to: process.env.VALIDATOR_REGISTRY_ADDRESS,
		data: data,
		chain: process.env.CHAIN,
	});

	console.log(receipt);
}

provider.engine.stop();