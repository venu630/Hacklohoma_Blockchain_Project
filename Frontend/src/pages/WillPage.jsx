import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiWillContract from "../data/MultiWillContract.json";

// PrimeReact imports
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const WillPage = () => {
  const [hasWill, setHasWill] = useState(null);
  const [contract, setContract] = useState(null);

  const navigate = useNavigate();

  const MULTI_WILL_CONTRACT_ADDRESS =
    "0x17F1589110996A7a29441Cbc0570ea82d3836B43";
  const location = useLocation();
  const { defaultAccount } = location.state || {};

  async function loadBlockchainData() {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        MULTI_WILL_CONTRACT_ADDRESS,
        MultiWillContract.abi,
        signer
      );

      setContract(contractInstance);

      if (defaultAccount) {
        const hasUserWill = await contractInstance.hasWill(defaultAccount);
        setHasWill(hasUserWill);
      }
    } catch (err) {
      alert("Error connecting to blockchain");
    }
  }

  useEffect(() => {
    loadBlockchainData();
  }, [defaultAccount]);

  const createWill = async () => {
    try {
      const tx = await contract.createWill();
      await tx.wait();
      setHasWill(true);
      alert("Will created successfully!");
    } catch (err) {
      alert("Error creating will");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <h2>Will Management</h2>

        <div className="mb-3">
          <strong>Wallet: </strong>
          {defaultAccount ? defaultAccount : "Not Connected"}
        </div>

        <div className="mb-3">
          <strong>Status: </strong>
          {hasWill ? "Will Already Present" : "No Will Found"}
        </div>

        {!hasWill ? (
          <Button
            label="Create Will"
            onClick={() => navigate("/beneficiaries")}
          />
        ) : (
          ""
        )}
      </Card>
    </div>
  );
};

export default WillPage;
