import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiWillContract from "../data/MultiWillContract.json";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const API_BASE_URL = "http://localhost:3000";

const WillPage = () => {
  const [hasWill, setHasWill] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulatingDeath, setSimulatingDeath] = useState(false);
  const [executingWill, setExecutingWill] = useState(false);

  const navigate = useNavigate();
  const MULTI_WILL_CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
  const location = useLocation();
  const { defaultAccount } = location.state || {};

  async function loadBlockchainData() {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required. Please install it.");
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

      if (defaultAccount) {
        const hasUserWill = await contractInstance.hasWill(defaultAccount);
        setHasWill(hasUserWill);

        if (hasUserWill) {
          const txnHash = await contractInstance.getWillTransactionHash(defaultAccount);
          if (txnHash && txnHash !== "0x") {
            setTransactionHash(txnHash);
          }
        }
      }
    } catch (err) {
      console.error("Error connecting to blockchain:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleExecuteWill = async () => {
    if (!contract) return alert("Smart contract not loaded.");

    setExecutingWill(true);
    try {
      const estimatedGas = await contract.estimateGas.executeWill(defaultAccount);
      const tx = await contract.executeWill(defaultAccount, { gasLimit: estimatedGas });
      await tx.wait();

      alert("Will executed successfully!");
      setHasWill(false);
    } catch (error) {
      console.error("Error executing will:", error);
    } finally {
      setExecutingWill(false);
    }
  };

  const handleSimulateDeath = async () => {
    setSimulatingDeath(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      alert("Death simulation completed!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to simulate death.");
    } finally {
      setSimulatingDeath(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [defaultAccount]);

  return (
    <div className="p-4">
      <Card>
        <h2>Will Management</h2>
        <p><strong>Wallet:</strong> {defaultAccount || "Not Connected"}</p>
        {loading ? <p>Loading...</p> : (
          <>
            <p><strong>Status:</strong> {hasWill ? "Will Already Present" : "No Will Found"}</p>
            {hasWill && transactionHash && (
              <p>
                <strong>Transaction Hash: </strong>
                <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">View on Etherscan</a>
              </p>
            )}
            {!hasWill && <Button label="Create Will" onClick={() => navigate("/beneficiaries")} />}
          </>
        )}
      </Card>
      {hasWill && (
        <Card>
          <h3>Testing Tools</h3>
          <Button label={simulatingDeath ? "Simulating..." : "Simulate Death"} loading={simulatingDeath} onClick={handleSimulateDeath} />
          <Button label={executingWill ? "Executing..." : "Execute Will"} loading={executingWill} onClick={handleExecuteWill} className="p-ml-2" />
        </Card>
      )}
    </div>
  );
};

export default WillPage;
