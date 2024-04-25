import fs from "fs";

function loadKeystorePubkey(keystorePath) {
	const keystore = JSON.parse(fs.readFileSync(keystorePath).toString());
	const pk = '0x' + keystore.pubkey;
	console.log(pk);
	return pk;
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

const validators = await getValidators(process.env.CL_ENDPOINT);

console.log('Downloaded validator info...');

let pks = []
const keystoreFilepaths = fs.readdirSync(process.env.KEYSTORE_DIR);
for (const filename of keystoreFilepaths) {
	if (filename.startsWith('keystore')) {
		const keystorePath = process.env.KEYSTORE_DIR + filename;
		const pk = loadKeystorePubkey(keystorePath);
		console.log('Loaded pubkey from ' + filename);
		pks.push(pk);
	}
}

console.log('Loaded all keystores...');

let res = {};
for (const pk of pks) {
	const validatorIndex = getValidatorIndex(pk, validators);
	console.log(validatorIndex + " : " + pk);
	res[validatorIndex] = pk;
}

fs.writeFileSync('validatorRegistrationInfo.json', JSON.stringify(res));
