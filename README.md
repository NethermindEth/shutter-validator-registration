# Shutter Validator Registration Scripts

- Set up your execution client from the [Nethermind Shutter branch](https://github.com/NethermindEth/nethermind/tree/feature/gnosis-shutter-release) or use the [docker image](https://hub.docker.com/layers/nethermindeth/nethermind/nethermind_shutter/images/sha256-16c4a71266467c8c181311c08f180e2e71da9467e6bbca04888d615295d44a70?context=explore) by running this command: `docker pull nethermindeth/nethermind:nethermind_shutter`
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
- The files `signedRegistrations.json` and `validatorInfo.json` will be generated.
- Run the following command to submit the signatures: `node --env-file=.env submit.js`
- Run the Nethermind client with the following arguments: `--Shutter.Enabled=true --Shutter.ValidatorInfoFile=[path to validatorInfo.json]`
