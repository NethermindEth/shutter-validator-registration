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
CHAIN=
CHAIN_ID=
VALIDATOR_REGISTRY_VERSION=0
VALIDATOR_REGISTRY_ADDRESS=0x06BfddbEbe11f7eE8a39Fc7DC24498dE85C8afca
NONCE = 0
SUBMISSIONS_PER_SEC = 1
```
- Use node v20.11.1
  - Sample installation on Linux:
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
    source ~/.bashrc
    nvm install 20.11.1
    ```
- Run `npm install`
- Run the following command to generate the registration signatures: `node --env-file=.env sign.js`
- The files `signedRegistrations.json` and `validatorInfo.json` will be generated.
- Run the following command to submit the signatures: `node --env-file=.env submit.js`
- To run the submission only for certain indices you can pass in a start index (inclusive) and an end index (non-inclusive) `node --env-file=.env submit.js [start] [end]` this can be used to parallelise submissions across multiple EL endpoints
- Run the Nethermind client with the following arguments: `--Shutter.Enabled=true --Shutter.Validator=true --Shutter.ValidatorInfoFile=[path to validatorInfo.json]`
