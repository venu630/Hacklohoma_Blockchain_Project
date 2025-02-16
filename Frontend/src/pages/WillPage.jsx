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
  const [simulatingDeath, setSimulatingDeath] = useState(false);
  const navigate = useNavigate();

  const MULTI_WILL_CONTRACT_ADDRESS =
    "0x1da9a4c1c3649c93e9c65791b212477e9af3b9df";
  const location = useLocation();
  const { defaultAccount } = location.state || {};

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

          const txnHash = await contractInstance.getWillTransactionHash(
            defaultAccount
          );

          if (txnHash && txnHash !== "0x") {
            console.log("📜 Retrieved Transaction Hash:", txnHash);
            setTransactionHash(txnHash);
          } else {
            console.warn("⚠️ No valid transaction hash found.");
          }
        }
      }
    } catch (err) {
      console.error("❌ Error connecting to blockchain:", err);
      alert("Error connecting to blockchain. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  const handleSimulateDeath = async () => {
    setSimulatingDeath(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Task result:", data);
      alert("Death simulation completed successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to trigger task. Please try again.");
    } finally {
      setSimulatingDeath(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [defaultAccount]);

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
                      <a
                        href={`https://sepolia.etherscan.io/address/${defaultAccount}`}
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
              label={simulatingDeath ? "Simulating..." : "Simulate Death Event"}
              loading={simulatingDeath}
              disabled={simulatingDeath}
              onClick={handleSimulateDeath}
            />
          </Card>
        </div>
      ) : null}
    </>
  );
};

export default WillPage;
