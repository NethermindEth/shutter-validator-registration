import fs from "fs";
import loadWeb3 from "web3";
import { decrypt, Keystore } from "@chainsafe/bls-keystore";
import bls from "@chainsafe/bls";
import minimist from "minimist";

const dst = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_";
const web3 = new loadWeb3(process.env.EL_ENDPOINT);
const validatorRegistryVersion = 1;

async function loadKeystore(keystorePath, password) {
	const keystoreRaw = fs.readFileSync(keystorePath).toString();
	const keystore = Keystore.fromObject(JSON.parse(keystoreRaw));
	const pk = '0x' + keystore.pubkey;
	const skBytes = await decrypt(keystore, password);
	const sk = bls.SecretKey.fromBytes(skBytes);
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
			return parseInt(validator.index);
		}
	}
}

function uintToBytesBigEndian(x, b) {
	let bytes = []
	for (let i = 0; i < b; i++) {
		bytes.unshift(x & 255);
		x >>= 8;
	}
	return bytes;
}
const uint64ToBytesBigEndian = (x) => uintToBytesBigEndian(x, 8);
const uint32ToBytesBigEndian = (x) => uintToBytesBigEndian(x, 4);

function computeUpdateMessage(startIndex, count, nonce, chainId, validatorRegistryAddress, version, register) {
	let bytes = [parseInt(version)];
	bytes = bytes.concat(uint64ToBytesBigEndian(chainId));
	bytes = bytes.concat(Array.from(web3.utils.hexToBytes(validatorRegistryAddress)));
	bytes = bytes.concat(uint64ToBytesBigEndian(startIndex));
	bytes = bytes.concat(uint32ToBytesBigEndian(count));
	bytes = bytes.concat(uint32ToBytesBigEndian(nonce)); 
	bytes = bytes.concat(register ? [1] : [0]); 
	return bytes;
}

const argv = minimist(process.argv.slice(2));

if (argv._.length == 0)
{
	console.error('Must pass start validator index.');
	process.exit(1);
}

let startIndex = parseInt(argv._[0]);
let endIndex = startIndex + 1;

if (argv._.length > 1)
{
	endIndex = parseInt(argv._[1]) + 1;
}

let nonce = 0;
if ('nonce' in argv)
{
	nonce = parseInt(argv['nonce']);
}

let register = true;
if ('--deregister' in argv)
{
	register = false;
}

const validators = await getValidators(process.env.CL_ENDPOINT);

console.log('Downloaded validator info...');

let validatorInfo = {}
let validatorSecretKeys = {}

const keystoreFilepaths = fs.readdirSync(process.env.KEYSTORE_DIR);
for (const filename of keystoreFilepaths) {
	if (filename.startsWith('keystore')) {
		const keystorePath = process.env.KEYSTORE_DIR + filename;
		const keystore = await loadKeystore(keystorePath, process.env.KEYSTORE_PASSWORD)
		const [sk, pk] = keystore;
		const validatorIndex = getValidatorIndex(pk, validators);

		console.log('Loaded keystore ' + filename);
		console.log(validatorIndex + ': ' + pk);
		validatorSecretKeys[validatorIndex] = sk;
		validatorInfo[validatorIndex] = pk;
	}
}

let missing = false;
for (let i = startIndex; i < endIndex; i++)
{
	if (!(i in validatorSecretKeys))
	{
		console.error('Missing keystore for validator ' + i);
		missing = true;
	}
}

if (missing)
{
	process.exit(1);
}

console.log('Loaded all keystores for indices ' + startIndex + ' up to ' + (endIndex - 1) + '...');

const count = endIndex - startIndex;
const message = computeUpdateMessage(startIndex, count, nonce, process.env.CHAIN_ID, process.env.VALIDATOR_REGISTRY_ADDRESS, validatorRegistryVersion, register);
let sigs = [];

for (let i = startIndex; i < endIndex; i++) {
	console.log('Generating signature for validator ' + i);

	const messageHash = web3.utils.hexToBytes(web3.utils.sha3(new Uint8Array(message)));
	const sig = validatorSecretKeys[i].sign(messageHash, dst);
	sigs.push(sig);
}

console.log('Aggregating signatures...');
const sig = bls.aggregateSignatures(sigs);

const messageHex = web3.utils.bytesToHex(message);
const sigHex = web3.utils.bytesToHex(sig);

console.log("(" + messageHex + ", " + sigHex + ")");
fs.writeFileSync('validatorInfo.json', JSON.stringify(validatorInfo));
fs.writeFileSync('signedRegistrations.json', JSON.stringify({'message': messageHex, 'signature': sigHex}));
