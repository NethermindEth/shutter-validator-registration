import fs from "fs";
import { execSync } from "child_process";
import loadWeb3 from "web3";
import { decrypt, Keystore } from "@chainsafe/bls-keystore";
import bls from "@chainsafe/bls";
import minimist from "minimist";

const dst = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_";
const web3 = new loadWeb3(process.env.EL_ENDPOINT);

async function loadKeystore(keystorePath, password) {
  const keystoreRaw = fs.readFileSync(keystorePath).toString();
  const keystore = Keystore.fromObject(JSON.parse(keystoreRaw));
  const skBytes = await decrypt(keystore, password);
  return bls.SecretKey.fromBytes(skBytes);
}

async function deriveKeysFromMnemonic(mnemonic, numValidators = 1) {
  console.log("Deriving keys from mnemonic...");
  const command = [
    "docker run --rm",
    `-e MNEMONIC="${mnemonic}"`,
    "ghcr.io/gnosischain/validator-data-generator:latest",
    `existing-mnemonic --num_validators=${numValidators} --folder=/app/output`
  ];
  execSync(command.join(" "), { stdio: "inherit" });
}

function computeUpdateMessage(validatorPubkey) {
  // Simplified message generation logic
  return web3.utils.sha3(`register:${validatorPubkey}`);
}

async function main() {
  const argv = minimist(process.argv.slice(2));
  const outputDir = "./output";

  if (process.env.MNEMONIC) {
    await deriveKeysFromMnemonic(process.env.MNEMONIC, 1);
  }

  const keystoreFile = argv.keystore || `${outputDir}/validator_keys/keystore-1.json`;
  const sk = await loadKeystore(keystoreFile, process.env.KEYSTORE_PASSWORD);

  console.log("Signing registration message...");
  const pubkey = "0x" + sk.toPublicKey().toHex();
  const message = computeUpdateMessage(pubkey);
  const sig = sk.sign(Buffer.from(message));

  fs.writeFileSync(
    `${outputDir}/signedRegistrations.json`,
    JSON.stringify({ pubkey, message, signature: sig.toHex() }, null, 2)
  );

  console.log("Registration file created: signedRegistrations.json");
}

main().catch(console.error);
