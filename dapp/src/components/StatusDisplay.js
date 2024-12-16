import React from "react";

function StatusDisplay({ status, transactionHash, walletAddress }) {
  return (
    <div>
      {status && <p><strong>Status:</strong> {status}</p>}
      {walletAddress && <p><strong>Wallet:</strong> {walletAddress}</p>}
      {transactionHash && (
        <p>
          <strong>Transaction Hash:</strong>
          <a href={`https://gnosisscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </p>
      )}
    </div>
  );
}

export default StatusDisplay;
