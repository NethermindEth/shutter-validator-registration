# Shutter Validator Registration Scripts

- Use node v20.17.0 to run the scripts (recommended: install with [nvm](https://github.com/nvm-sh/nvm))
- Generate your validator signing keys keystore file with the [generator tool](https://github.com/gnosischain/validator-data-generator/tree/master)
- Create a temporary burner wallet that will cover the gas fees to submit the registrations. Each submission uses 189,736 gas, or ~0.19¢ at a base fee of 10Gwei ([current base fee](https://gnosisscan.io/gastracker)).
- You will need EL and CL endpoints in order to run the scripts.
- Create a .env file, following the following format:

<details>
<summary>Gnosis</summary>

```
EL_ENDPOINT=
CL_ENDPOINT=
KEYSTORE_DIR=
KEYSTORE_PASSWORD=
WALLET_SEED=[burner wallet seed phrase]
WALLET_ADDRESS=[burner wallet seed address]
CHAIN=gnosis
CHAIN_ID=100
VALIDATOR_REGISTRY_ADDRESS=0xefCC23E71f6bA9B22C4D28F7588141d44496A6D6
SUBMISSIONS_PER_SEC=1
```
</details>

<details>
<summary>Chiado</summary>

```
EL_ENDPOINT=
CL_ENDPOINT=
KEYSTORE_DIR=
KEYSTORE_PASSWORD=
WALLET_SEED=[burner wallet seed phrase]
WALLET_ADDRESS=[burner wallet seed address]
CHAIN=chiado
CHAIN_ID=10200
VALIDATOR_REGISTRY_ADDRESS=0x06BfddbEbe11f7eE8a39Fc7DC24498dE85C8afca
SUBMISSIONS_PER_SEC=1
```

</details>

- Generate the registration signatures: `node --env-file=.env sign.js`
- The files `signedRegistrations.json` and `validatorInfo.json` will be generated.
- Submit the signatures to register your validators: `node --env-file=.env submit.js`
- To run the submission only for certain indices you can pass in start end indexes (inclusive) `node --env-file=.env submit.js [start] [end]` this can be used to parallelise submissions across multiple EL endpoints
- To deregister your validators, increment the nonce to the correct value and generate the signatures with `node --env-file=.env sign.js [nonce] --deregister`
- Run the Nethermind client with the following arguments: `--Shutter.Enabled=true --Shutter.ValidatorInfoFile=[path to validatorInfo.json]`
- If any of your validators were not registered there will be an error message on startup