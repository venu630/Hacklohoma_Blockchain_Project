import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import contractABI from "../data/MultiWillContract.json"; // Import contract ABI

const CONTRACT_ADDRESS = "0x1da9a4c1c3649c93e9c65791b212477e9af3b9df"; // Replace with your deployed contract address

const BeneficiaryForm = () => {
  const location = useLocation();
  const willOwner = location.state?.willOwner || ""; // Get will owner's address from navigation state

  const [formData, setFormData] = useState({
    walletAddress: "",
    email: "",
    percentageShare: "",
  });
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔹 Detect MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetaMaskInstalled(true);
    } else {
      setIsMetaMaskInstalled(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔹 Upload Sale Deed to Pinata (IPFS)
  const uploadToPinata = async () => {
    if (!file) {
      alert("❌ Please select a file first.");
      return null;
    }

    const data = new FormData();
    data.append("file", file);
    const metadata = JSON.stringify({ name: file.name });
    data.append("pinataMetadata", metadata);
    const options = JSON.stringify({ cidVersion: 0 });
    data.append("pinataOptions", options);

    try {
      console.log("📤 Uploading file to Pinata...");
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "d0b6f6d2a44acded0a6f",
            pinata_secret_api_key:
              "c2d78fe6f4a0e844b5c1a5aa45c060c743e2a32d45a0955770e656cd27c12c0a",
          },
        }
      );

      console.log("✅ File uploaded to IPFS:", response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (err) {
      console.error("❌ Pinata upload failed", err);
      return null;
    }
  };

  // 🔹 Handle Form Submission (Blockchain Storage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setErrorMessage("");

    try {
      // 1️⃣ Ensure MetaMask is Installed
      if (!isMetaMaskInstalled) {
        alert("❌ MetaMask is not detected. Please install MetaMask.");
        setIsUploading(false);
        return;
      }

      // 2️⃣ Validate Wallet Address
      if (!ethers.utils.isAddress(formData.walletAddress)) {
        alert("❌ Invalid wallet address.");
        setIsUploading(false);
        return;
      }

      // 3️⃣ Validate Percentage
      const percentage = parseInt(formData.percentageShare);
      if (percentage < 1 || percentage > 100) {
        alert("❌ Percentage must be between 1 and 100.");
        setIsUploading(false);
        return;
      }

      // 4️⃣ Upload Sale Deed to Pinata
      const uploadedIpfsHash = await uploadToPinata();
      if (!uploadedIpfsHash) {
        alert("❌ File upload failed!");
        setIsUploading(false);
        return;
      }
      setIpfsHash(uploadedIpfsHash);

      // 5️⃣ Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // 6️⃣ Connect to Smart Contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      // 7️⃣ Manually Estimate Gas
      console.log("⏳ Estimating gas...");
      const gasLimit = await contract.estimateGas.addBeneficiary(
        formData.walletAddress,
        percentage,
        uploadedIpfsHash,
        formData.email
      );

      console.log(`✅ Estimated Gas Limit: ${gasLimit.toString()}`);

      // 8️⃣ Execute Contract Function
      console.log("📤 Sending Transaction...");
      console.log("Will Owner:", willOwner);
      console.log("Wallet Address:", formData.walletAddress);
      console.log("Percentage Share:", percentage);
      console.log("IPFS Hash:", uploadedIpfsHash);
      console.log("Email:", formData.email);

      const transaction = await contract.addBeneficiary(
        formData.walletAddress,
        percentage,
        uploadedIpfsHash,
        formData.email,
        { gasLimit }
      );

      const result = await transaction.wait();
      setTransactionHash(result.transactionHash);
      alert(
        `✅ Beneficiary added successfully! Transaction Hash: ${result.transactionHash}`
      );
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setErrorMessage("❌ Submission failed! Check the console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Add Beneficiary</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="walletAddress"
          placeholder="Wallet Address"
          value={formData.walletAddress}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Beneficiary Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="percentageShare"
          placeholder="Percentage Share"
          value={formData.percentageShare}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={isUploading || !isMetaMaskInstalled}>
          {isUploading ? "Processing..." : "Add Beneficiary"}
        </button>

        {errorMessage && <p style={{ color: "red" }}>❌ {errorMessage}</p>}
        {ipfsHash && (
          <p>
            📂 Uploaded to IPFS:{" "}
            <a
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ipfsHash}
            </a>
          </p>
        )}
        {transactionHash && (
          <p>
            ✅ Transaction Successful!{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </p>
        )}
      </form>
    </div>
  );
};

export default BeneficiaryForm;
