import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import StatusDisplay from "./components/StatusDisplay";
import Web3 from "web3";

function App() {
  const [status, setStatus] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleFileUpload = async (fileContent) => {
    try {
      const { message, signature } = JSON.parse(fileContent);

      // Connect to wallet
      const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_EL_ENDPOINT);
      const accounts = await web3.eth.requestAccounts();
      setWalletAddress(accounts[0]);

      // Encode the transaction data
      const encodedData = web3.eth.abi.encodeFunctionCall(
        {
          inputs: [
            { name: "message", type: "bytes" },
            { name: "signature", type: "bytes" },
          ],
          name: "update",
          type: "function",
        },
        [message, signature]
      );

      // Send the transaction
      const tx = {
        from: accounts[0],
        to: process.env.REACT_APP_VALIDATOR_REGISTRY_ADDRESS,
        data: encodedData,
      };

      const receipt = await web3.eth.sendTransaction(tx);
      setTransactionHash(receipt.transactionHash);
      setStatus("Transaction successful!");
    } catch (error) {
      console.error(error);
      setStatus("Error submitting the transaction.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Validator Registration DApp</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      <StatusDisplay status={status} transactionHash={transactionHash} walletAddress={walletAddress} />
    </div>
  );
}

export default App;
