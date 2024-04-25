import fs from "fs";
import loadWeb3 from "web3";
import { decrypt, Keystore } from "@chainsafe/bls-keystore";
import loadBls from "bls-signatures";

const bls = await loadBls();
const web3 = new loadWeb3(process.env.EL_ENDPOINT);

async function loadKeystore(keystorePath, password) {
	const keystoreRaw = fs.readFileSync(keystorePath).toString();
	const keystore = Keystore.fromObject(JSON.parse(keystoreRaw));
	const pk = '0x' + keystore.pubkey;
	const skBytes = await decrypt(keystore, password);
	const sk = new bls.PrivateKey.from_bytes(skBytes, false);
	return [sk, pk];
}

async function getValidators(beaconEndpoint) {
	const response = await fetch(beaconEndpoint + '/eth/v1/beacon/states/head/validators');
	if (response.status === 200) {
		return (await response.json()).data;
	}
}

function getValidatorIndex(pubkey, validators) {
	for (let validator of validators) {
		if (pubkey === validator.validator.pubkey) {
			return validator.index;
		}
	}
}

function uint64ToBytesBigEndian(x) {
	let bytes = []
	for (let i = 0; i < 8; i++) {
		bytes.unshift(x & 255);
		x >>= 8;
	}
	return bytes;
}

function computeValidatorRegistryMessagePrefix(validatorIndex, nonce) {
	let bytes = [parseInt(process.env.VALIDATOR_REGISTRY_VERSION)]; // validator registry version
	bytes = bytes.concat(uint64ToBytesBigEndian(process.env.CHAIN_ID)); // chain id
	bytes = bytes.concat(Array.from(web3.utils.hexToBytes(process.env.VALIDATOR_REGISTRY_ADDRESS))); // validator registry address
	bytes = bytes.concat(uint64ToBytesBigEndian(validatorIndex)); // validator index
	bytes = bytes.concat(uint64ToBytesBigEndian(nonce)); // nonce
	console.log(bytes);
	return bytes;
}

function computeRegistrationMessage(validatorIndex, nonce) {
	return computeValidatorRegistryMessagePrefix(validatorIndex, nonce).concat([1]);
}

// function computeDeregistrationMessage(validatorIndex, nonce) {
// 	return computeValidatorRegistryMessagePrefix(validatorIndex, nonce).concat([0]);
// }

const validators = await getValidators(process.env.CL_ENDPOINT);

console.log('Downloaded validator info...');

let keystores = []
const keystoreFilepaths = fs.readdirSync(process.env.KEYSTORE_DIR);
for (const filename of keystoreFilepaths) {
	if (filename.startsWith('keystore')) {
		const keystorePath = process.env.KEYSTORE_DIR + filename;
		const keystore = await loadKeystore(keystorePath, process.env.KEYSTORE_PASSWORD)
		console.log('Loaded keystore ' + filename);
		keystores.push(keystore);
	}
}

console.log('Loaded all keystores...');

let res = {};
for (const [sk, pk] of keystores) {
	const validatorIndex = getValidatorIndex(pk, validators);
	console.log('Generating registration for validator ' + validatorIndex);

	const message = computeRegistrationMessage(validatorIndex, process.env.NONCE);
	const messageHex = web3.utils.bytesToHex(message);
	const messageHash = web3.utils.hexToBytes(web3.utils.sha3(new Uint8Array(message)));
	const sig = bls.AugSchemeMPL.sign(sk, messageHash);
	const sigHex = bls.Util.hex_str(sig.serialize());

	console.log(validatorIndex + " : (" + messageHex + ", " + sigHex + ")");
	res[validatorIndex] = {
		'message': messageHex,
		'signature': sigHex
	};
}

fs.writeFileSync('validatorRegistrations.json', JSON.stringify(res));
