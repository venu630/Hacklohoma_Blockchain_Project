import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Message } from "primereact/message";
import { ethers } from "ethers";
import axios from "axios";
import contractABI from "../data/MultiWillContract.json";

const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

const BeneficiaryForm = () => {
    const location = useLocation();
    const willOwner = location.state?.willOwner || "";
    
    const [formData, setFormData] = useState({
        walletAddress: "",
        email: "",
        percentageShare: "",
    });
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!window.ethereum) {
            setErrorMessage("MetaMask is not installed. Please install it to continue.");
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadToPinata = async () => {
        if (!file) {
            alert("❌ Please select a file first.");
            return null;
        }

        const data = new FormData();
        data.append("file", file);
        data.append("pinataMetadata", JSON.stringify({ name: file.name }));
        data.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setErrorMessage("");

        if (!ethers.utils.isAddress(formData.walletAddress)) {
            setErrorMessage("❌ Invalid wallet address.");
            setIsUploading(false);
            return;
        }

        const percentage = parseInt(formData.percentageShare);
        if (percentage < 1 || percentage > 100) {
            setErrorMessage("❌ Percentage must be between 1 and 100.");
            setIsUploading(false);
            return;
        }

        const uploadedIpfsHash = await uploadToPinata();
        if (!uploadedIpfsHash) {
            setErrorMessage("❌ File upload failed!");
            setIsUploading(false);
            return;
        }
        setIpfsHash(uploadedIpfsHash);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

            const gasLimit = await contract.estimateGas.addBeneficiary(
                formData.walletAddress,
                percentage,
                uploadedIpfsHash,
                formData.email
            );

            const transaction = await contract.addBeneficiary(
                formData.walletAddress,
                percentage,
                uploadedIpfsHash,
                formData.email,
                { gasLimit }
            );

            const result = await transaction.wait();
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
        <div style={{ border: "1px solid #ccc", padding: "2rem", margin: "1rem auto", width: "50%" }}>
            <h3>Create Your Beneficiary</h3>
            <form onSubmit={handleSubmit} className="p-fluid">
                {/* Wallet Address */}
                <div className="field">
                    <span className="p-float-label">
                        <InputText
                            id="walletAddress"
                            name="walletAddress"
                            value={formData.walletAddress}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="walletAddress">Wallet Address*</label>
                    </span>
                </div>

                {/* Email */}
                <div className="field">
                    <span className="p-float-label">
                        <InputText
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Beneficiary Email*</label>
                    </span>
                </div>

                {/* Percentage Share */}
                <div className="field">
                    <span className="p-float-label">
                        <InputText
                            id="percentageShare"
                            name="percentageShare"
                            value={formData.percentageShare}
                            onChange={handleChange}
                            keyfilter="num"
                            required
                        />
                        <label htmlFor="percentageShare">Percentage Share (1-100%)*</label>
                    </span>
                </div>

                {/* File Upload */}
                <div className="field">
                    <FileUpload
                        mode="basic"
                        accept="application/pdf"
                        maxFileSize={5000000}
                        onSelect={(e) => setFile(e.files[0])}
                        required
                    />
                    <small>Upload Sale Deed (PDF only)</small>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    label={isUploading ? "Processing..." : "Add Beneficiary"}
                    className="p-mt-2"
                    disabled={isUploading}
                />

                {/* Error / Success Messages */}
                {errorMessage && <Message severity="error" text={errorMessage} />}
                {ipfsHash && (
                    <Message severity="success" text={`📂 Uploaded to IPFS: `}>
                        <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">
                            {ipfsHash}
                        </a>
                    </Message>
                )}
                {transactionHash && (
                    <Message severity="success" text={`✅ Transaction Successful! `}>
                        <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                            {transactionHash}
                        </a>
                    </Message>
                )}
            </form>
        </div>
    );
};

export default BeneficiaryForm;
