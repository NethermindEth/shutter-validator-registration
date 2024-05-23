# Shutter Validator Registration Scripts

- Set up your execution client from the [Nethermind Shutter branch](https://github.com/NethermindEth/nethermind/tree/da931d84f900e93883134d7073e871434982ac6a), ensuring that all submodules are checked out
- Generate your validator signing keys keystore file with the [generator tool](https://github.com/gnosischain/validator-data-generator/tree/master)
- Create a burner address that will be used to submit the registrations
- Create a .env file, following the following format:
```
EL_ENDPOINT=
CL_ENDPOINT=
KEYSTORE_DIR=
KEYSTORE_PASSWORD=
WALLET_SEED=
WALLET_ADDRESS=
CHAIN_ID=
VALIDATOR_REGISTRY_VERSION=0
VALIDATOR_REGISTRY_ADDRESS=0x06BfddbEbe11f7eE8a39Fc7DC24498dE85C8afca
NONCE = 0
```
- Run the following command to generate the registration signatures: `node --env-file=.env sign.js`
- Run the following command to submit the signatures: `node --env-file=.env submit.js`

