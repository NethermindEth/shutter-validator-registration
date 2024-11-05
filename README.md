# Shutter Validator Registration Scripts

- Use node v20.17.0 to run the scripts (recommended: install with [nvm](https://github.com/nvm-sh/nvm))
- Generate your validator signing keys keystore file with the [generator tool](https://github.com/gnosischain/validator-data-generator/tree/master)
<<<<<<< HEAD
- Create a temporary burner wallet that will cover the gas fees to submit the registrations. Each submission uses 189,736 gas, or ~0.19¢ at a base fee of 10Gwei ([current base fee](https://gnosisscan.io/gastracker)).
=======
- Create a temporary burner wallet that will cover the gas fees to submit the registrations. A submission uses 189,736 gas, or ~0.19¢ at a base fee of 10Gwei ([current base fee](https://gnosisscan.io/gastracker)).
>>>>>>> 27223c7 (v1)
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
```

</details>

- Generate the registration signatures for a single validator: `node --env-file=.env sign.js index`
- Generate the registration signatures for multiple consecutive validator keys (end index inclusive): `node --env-file=.env sign.js startIndex endIndex`
- The files `signedRegistrations.json` and `validatorInfo.json` will be generated. If you run the script multiple times you will need to combine all of the `validatorInfo.json` into one file.
- Submit the signatures to register your validators: `node --env-file=.env submit.js`
- To deregister your validators, increment the nonce to the correct value (here we assume nonce=1) and generate the signatures with `node --env-file=.env sign.js --nonce 1 --deregister`
- Run the Nethermind client with the following arguments: `--Shutter.Enabled=true --Shutter.ValidatorInfoFile=[path to validatorInfo.json]`
- If any of your validators were not registered there will be an error message on startup