import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiWillContract from "../data/MultiWillContract.json";

// PrimeReact imports
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const API_BASE_URL = "http://localhost:3000";

const WillPage = () => {
  const [hasWill, setHasWill] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const MULTI_WILL_CONTRACT_ADDRESS =
    "0x96f3c7bcc7f098b9f12219a2842235863ec0a774"; // Replace with deployed contract address
  const location = useLocation();
  const { defaultAccount } = location.state || {};

  // 🔹 Load Blockchain Data (Check if User Has a Will)
  async function loadBlockchainData() {
    try {
      if (!window.ethereum) {
        alert("❌ MetaMask is not installed. Please install it first.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        MULTI_WILL_CONTRACT_ADDRESS,
        MultiWillContract.abi,
        signer
      );

      setContract(contractInstance);
      console.log("🔗 Connected Account:", defaultAccount);

      if (defaultAccount) {
        const hasUserWill = await contractInstance.hasWill(defaultAccount);
        setHasWill(hasUserWill);

        if (hasUserWill) {
          console.log("✅ User has a will. Fetching transaction hash...");

          // 🔹 Fetch only the transaction hash
          const txnHash = await contractInstance.getWillTransactionHash(
            defaultAccount
          );
          console.log("📜 Transaction Hash:", txnHash);

          setTransactionHash(txnHash);
        }
      }
    } catch (err) {
      console.error("❌ Error connecting to blockchain:", err);
      alert("Error connecting to blockchain. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlockchainData();
  }, [defaultAccount]); // Run when defaultAccount changes

  return (
    <>
      <div className="p-4">
        <Card>
          <h2>Will Management</h2>

          <div className="mb-3">
            <strong>Wallet: </strong>
            {defaultAccount ? defaultAccount : "Not Connected"}
          </div>

          {loading ? (
            <p>🔄 Loading...</p>
          ) : (
            <>
              <div className="mb-3">
                <strong>Status: </strong>
                {hasWill ? "✅ Will Already Present" : "❌ No Will Found"}
              </div>

              {hasWill ? (
                <>
                  <div>
                    <p>
                      <strong>Transaction Hash:</strong> {transactionHash}
                    </p>
                    <p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🔗 View on Etherscan
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <Button
                  label="Create Will"
                  onClick={() => navigate("/beneficiaries")}
                />
              )}
            </>
          )}
        </Card>
      </div>
      {hasWill ? (
        <div className="p-4">
          <Card>
            <h3>Testing Tools</h3>
            <Button
              severity="warning"
              label="Simulate Death Event"
              onClick={async () => {
                try {
                  const response = await fetch(
                    `${API_BASE_URL}/api/tasks/trigger`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  const data = await response.json();
                  console.log("Task result:", data);
                } catch (error) {
                  console.error("Error:", error);
                  alert("Failed to trigger task");
                }
              }}
            />
          </Card>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default WillPage;
