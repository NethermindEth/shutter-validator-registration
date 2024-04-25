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

const encryptedTransaction = web3.utils.hexToBytes("93851548A067741D07883366230F7EBC94135BDD352A8ACBE36A077EB91F09ABA56E69AEF179071FA5EE73837CD35A9010DC4FEFE8B7EEBB81009AB95EFF134EC8BC2F656868D6921B665B9AE0EA5B7501BB6FD467E70FF3902A824D7BB3B7773E1E0E5C8133F7F06FF729E3D897F27478A4332716FDAA3259C69E40877057DCF2F52D4E932A267FDB276E45514E481EEFA704618191948CF486DF5B1DAA4F291D74C6EDC2E34F004CD37B082A74E65CACDFA324D67CBECDF465D79168CC8D0784174EB2F42756759922382C39FEFA1A95ED8768F0A614EB280C4BA7358B6121AB17A92740BDE5B829FED511D20B56291618ADE26CB50CAE91C758136654B135");
const identityPrefix = web3.utils.hexToBytes("3834a349678eF446baE07e2AefFC01054184af00383438343834383438343834");
// const encryptedTransaction = [];

const tx = await web3.eth.accounts.signTransaction({
    from: "0x3834a349678eF446baE07e2AefFC01054184af00",
    gasPrice: "2500000000",
    gas: "21000",
    to: '0x3834a349678eF446baE07e2AefFC01054184af00',
    value: "1000",
    data: "",
    nonce: "584",
    chainId: "10200",
    type: "0x0"
}, process.env.PRIVATE_KEY);

console.log(tx);
// console.log(web3.eth.accounts.recoverTransaction(tx.rawTransaction));

const data = web3.eth.abi.encodeFunctionCall({
    "inputs": [
      {
	"name": "eon",
	"type": "uint64",
      },
      {
	"name": "identityPrefix",
	"type": "bytes32",
      },
      {
	"name": "encryptedTransaction",
	"type": "bytes",
      },
      {
	"name": "gasLimit",
	"type": "uint256",
      },
    ],
    "name": "submitEncryptedTransaction",
    "type": "function"
}, [
	1,
	identityPrefix,
	encryptedTransaction,
	21000
	// web3.utils.hexToBytes(registrationMessage.signature)
]);

console.log(data);

// send transaction
if (encryptedTransaction.length != 0)
{
	const receipt = await web3.eth.sendTransaction({
		from: process.env.WALLET_ADDRESS,
		to: process.env.SEQUENCER_ADDRESS,
		data: data,
		chain: 'chiado',
		value: '0x5AF3107A4000'
	});
	console.log("receipt: " + receipt);
}

provider.engine.stop();
