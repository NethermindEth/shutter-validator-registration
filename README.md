# Shutter Validator Registration Scripts

- Download your validator hot keys keystore file
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
SEQUENCER_ADDRESS=0x854ce9415d1Ee1d95ACf7d0F2c718AaA9A5894aa
KEYPER_SET_MANAGER_ADDRESS=0x847efd7D3a8b4AF8226bc156c330002d1c06Cf75
NONCE = 0
```
- Run the following command to generate the registration signatures: `node --env-file=.env sign.js`
- Run the following command to submit the signatures: `node --env-file=.env submit.js`

