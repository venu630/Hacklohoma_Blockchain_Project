import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import contractABI from "../data/MultiWillContract.json"; // Import contract ABI

const CONTRACT_ADDRESS = "0x17f1589110996a7a29441cbc0570ea82d3836b43"; // Replace with your deployed contract address

const BeneficiaryForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
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
            alert("Please select a file first.");
            return null;
        }

        const data = new FormData();
        data.append("file", file);
        const metadata = JSON.stringify({ name: file.name });
        data.append("pinataMetadata", metadata);
        const options = JSON.stringify({ cidVersion: 0 });
        data.append("pinataOptions", options);

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    pinata_api_key: "d0b6f6d2a44acded0a6f",
                    pinata_secret_api_key: "c2d78fe6f4a0e844b5c1a5aa45c060c743e2a32d45a0955770e656cd27c12c0a",
                },
            });

            return response.data.IpfsHash;
        } catch (err) {
            console.error("Pinata upload failed", err);
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

            // 2️⃣ Upload Sale Deed to Pinata
            const uploadedIpfsHash = await uploadToPinata();
            if (!uploadedIpfsHash) {
                alert("File upload failed!");
                setIsUploading(false);
                return;
            }
            setIpfsHash(uploadedIpfsHash);

            // 3️⃣ Connect to MetaMask & Get Provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Request account access
            const signer = provider.getSigner(); // Get the connected account

            // 4️⃣ Connect to Smart Contract
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

            // 5️⃣ Execute Smart Contract Function (Adding Beneficiary)
            const transaction = await contract.addBeneficiary(
                formData.walletAddress,
                parseInt(formData.percentageShare),
                uploadedIpfsHash,
                formData.email
            );

            const result = await transaction.wait(); // Wait for transaction confirmation

            // 6️⃣ Display Transaction Hash
            setTransactionHash(result.transactionHash);
            alert(`✅ Beneficiary added successfully! Transaction Hash: ${result.transactionHash}`);

        } catch (error) {
            console.error("❌ Error submitting form:", error);
            setErrorMessage("Submission failed! Check the console for details.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Beneficiary Form</h2>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <input type="text" name="walletAddress" placeholder="Wallet Address" value={formData.walletAddress} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Beneficiary Email" value={formData.email} onChange={handleChange} required />
            <input type="number" name="percentageShare" placeholder="Percentage Share" value={formData.percentageShare} onChange={handleChange} required />
            <input type="file" accept="application/pdf" onChange={handleFileChange} required />

            <button type="submit" disabled={isUploading || !isMetaMaskInstalled}>
                {isUploading ? "Processing..." : "Submit"}
            </button>

            {errorMessage && <p style={{ color: "red" }}>❌ {errorMessage}</p>}
            {ipfsHash && <p>📂 Uploaded to IPFS: <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">{ipfsHash}</a></p>}
            {transactionHash && <p>✅ Transaction Successful! <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a></p>}
        </form>
    );
};

export default BeneficiaryForm;
