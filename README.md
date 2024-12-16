### **Validator Registration Workflow**

This guide provides step-by-step instructions for generating validator registration signatures using an existing validator mnemonic or keystore files and submitting them to the Gnosis Chain using a DApp. It also includes an optional step for uploading registration files when the DApp is hosted on a separate machine.

---

## **Overview**

The workflow consists of two main components:
1. **Validator Script**:
   - Uses an existing validator mnemonic or keystore files to create the `signedRegistrations.json` file required for registration.
2. **Validator Registration DApp**:
   - Uploads the `signedRegistrations.json` file.
   - Submits the registration to the `VALIDATOR_REGISTRY_ADDRESS` smart contract.

---

## **1. Validator Script**

### **Features**
- Uses an existing BIP-39 mnemonic or pre-generated keystore files to generate registration signatures.
- Creates the `signedRegistrations.json` file with validator registration data.
- Preconfigured with Gnosis Chain endpoints and contract addresses.

---

### **Requirements**

- Docker installed on your system.
- Access to:
  - An existing BIP-39 mnemonic **or** keystore files for your validator keys.
  - The password for the keystore files.

#### **Preconfigured `.env` File**
The `script/.env.example` file is provided with preconfigured values. Copy it to create your own `.env` file.

```bash
cp script/.env.example script/.env
```

#### **Example `.env` (script/.env.example)**
```plaintext
# Gnosis Chain Execution Layer (EL) RPC Endpoint
EL_ENDPOINT=https://rpc.gnosis.gateway.fm

# Gnosis Chain Consensus Layer (CL) RPC Endpoint
CL_ENDPOINT=https://rpc-gbc.gnosischain.com

# Validator Registry Contract Address
VALIDATOR_REGISTRY_ADDRESS=0xefCC23E71f6bA9B22C4D28F7588141d44496A6D6

# Chain Configuration
CHAIN_ID=100

# Validator Keystore Password
KEYSTORE_PASSWORD=your-keystore-password

# Path to Keystore Files or Mnemonic
KEYSTORE_DIR=/path/to/validator_keys/    # If using keystore files
MNEMONIC="your twelve word mnemonic here" # If using a mnemonic
```

---

### **How to Run**

#### **Step 1: Build the Docker Image**
Build the validator script Docker image:
```bash
docker build -t validator-script -f docker/Dockerfile.script .
```

#### **Step 2: Run the Script**

Run the Docker container to generate registration signatures:
```bash
# Using existing keystore files
docker run --rm -v $(pwd)/output:/app/output -v $(pwd)/validator_keys:/app/validator_keys validator-script

# Using a mnemonic
docker run --rm -v $(pwd)/output:/app/output validator-script --use-mnemonic
```

---

### **Outputs**

1. **`signedRegistrations.json`**:
   - Contains the `message` and `signature` required for registration.

2. **`validatorInfo.json`**:
   - Contains metadata for configuring your validator node.

---

### **Optional Step: Upload Registration Files**

If you are generating registration files on a remote server (e.g., via SSH) and need to upload them to a machine running the DApp, follow these steps:

#### **Using SCP (Secure Copy)**
1. On your local machine, run:
   ```bash
   scp -r user@server:/path/to/output/signedRegistrations.json /local/path/
   ```
   - Replace `user` with your SSH username.
   - Replace `/path/to/output/` with the directory where the registration files are saved on the server.
   - Replace `/local/path/` with the directory on your local machine where the file should be copied.

#### **Using SFTP**
1. Open an SFTP session:
   ```bash
   sftp user@server
   ```
2. Navigate to the output directory:
   ```bash
   cd /path/to/output/
   ```
3. Download the file:
   ```bash
   get signedRegistrations.json
   ```

---

## **2. Validator Registration DApp**

### **Features**
- Provides a simple interface for submitting `signedRegistrations.json`.
- Integrates with Web3 wallets like MetaMask.
- Displays transaction status and confirmation.

---

### **Requirements**

#### **Preconfigured `.env` File**
The `dapp/.env.example` file is provided with preconfigured values. Copy it to create your own `.env` file.

```bash
cp dapp/.env.example dapp/.env
```

#### **Example `.env` (dapp/.env.example)**
```plaintext
REACT_APP_EL_ENDPOINT=https://rpc.gnosis.gateway.fm
REACT_APP_VALIDATOR_REGISTRY_ADDRESS=0xefCC23E71f6bA9B22C4D28F7588141d44496A6D6
```

---

### **How to Run**

#### **Option 1: Local Development**

1. Navigate to the `dapp/` directory:
   ```bash
   cd dapp/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the DApp in your browser:
   ```plaintext
   http://localhost:3000
   ```

---

#### **Option 2: Run Using Docker**

1. Build the Docker image:
   ```bash
   docker build -t validator-dapp -f docker/Dockerfile.dapp .
   ```

2. Run the Docker container:
   ```bash
   docker run --rm -p 3000:3000 validator-dapp
   ```

3. Open the DApp in your browser:
   ```plaintext
   http://localhost:3000
   ```

---

### **Using the DApp**

1. **Upload `signedRegistrations.json`**:
   - Use the file upload button to select the `signedRegistrations.json` file generated by the script.

2. **Connect Wallet**:
   - Connect your Web3 wallet (e.g., MetaMask).
   - Ensure the wallet has sufficient funds to cover gas fees.

3. **Submit Signatures**:
   - Click the "Submit" button to send the registration data.
   - Wait for the transaction confirmation.

4. **View Transaction**:
   - The DApp will display the transaction hash.
   - You can view it on [GnosisScan](https://gnosisscan.io/).

---

## **3. Validator Node Setup**

Use the `validatorInfo.json` file generated by the script to configure your validator node.

#### **Example Command for Nethermind**
```bash
nethermind --Shutter.Enabled=true --Shutter.ValidatorInfoFile=/path/to/output/validatorInfo.json
```

---

## **4. Directory Structure**

```
project-root/
├── output/
│   ├── signedRegistrations.json   # Registration signatures
│   ├── validatorInfo.json         # Validator configuration
├── dapp/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   ├── .env                       # DApp configuration (ignored in Git)
│   ├── .env.example               # Example DApp configuration
│   ├── Dockerfile
│   ├── package.json
├── script/
│   ├── validator_script.js        # Main validator script
│   ├── .env                       # Script configuration (ignored in Git)
│   ├── .env.example               # Example script configuration
├── docker/
│   ├── Dockerfile.script          # Dockerfile for the script
│   ├── Dockerfile.dapp            # Dockerfile for the DApp
├── README.md                      # This documentation
