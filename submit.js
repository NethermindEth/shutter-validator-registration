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
var endIndex = Number.MAX_VALUE;
if (process.argv.length > 2)
{
	startIndex = parseInt(process.argv[2]);
}
if (process.argv.length > 3)
{
	endIndex = parseInt(process.argv[3]);
}

for (const validatorIndex in signedRegistrations) {
	if (validatorIndex < startIndex || validatorIndex > endIndex)
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
	var send = async () => {
		await web3.eth.sendTransaction({
			from: process.env.WALLET_ADDRESS,
			to: process.env.VALIDATOR_REGISTRY_ADDRESS,
			data: data,
			chain: process.env.CHAIN,
		})
		.then((receipt) => {
			console.log("submitted " + validatorIndex + " in " + receipt.transactionHash);
			return;
		})
		.catch(console.error);
	}

	send();
	await new Promise(resolve => setTimeout(resolve, 1000 / process.env.SUBMISSIONS_PER_SEC));
}

provider.engine.stop();