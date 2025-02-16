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
    const [loading, setLoading] = useState(true);  const [isSimulating, setIsSimulating] = useState(false);

    const navigate = useNavigate();

    const MULTI_WILL_CONTRACT_ADDRESS = "0x96f3c7bcc7f098b9f12219a2842235863ec0a774"; // Replace with deployed contract address
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
                    const txnHash = await contractInstance.getWillTransactionHash(defaultAccount);
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

    // 🔹 Create Will Function
    const createWill = async () => {
        try {
            if (!contract) {
                alert("❌ Contract not loaded yet. Please try again.");
                return;
            }

            const firstName = prompt("Enter your first name:");
            const lastName = prompt("Enter your last name:");

            if (!firstName || !lastName) {
                alert("❌ First name and last name are required.");
                return;
            }

            const ethAmount = "0.02"; // 🔹 Reduce ETH amount to 0.02 instead of 0.1

            console.log("🚀 Creating will with:", {
                firstName,
                lastName,
                ethAmount,
            });

            const tx = await contract.createWill(firstName, lastName, {
                value: ethers.utils.parseEther(ethAmount), // 🔹 Send only 0.02 ETH
            });

            const receipt = await tx.wait();
            console.log("✅ Will Created! Transaction:", receipt);

            setHasWill(true);
            setTransactionHash(receipt.transactionHash);
            alert(`✅ Will created successfully! Tx Hash: ${receipt.transactionHash}`);

        } catch (err) {
            console.error("❌ Error creating will:", err);
            alert("Error creating will. Check console for details.");
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

                {loading ? (
                    <p>🔄 Loading...</p>
                ) : (
                    <>
                        <div className="mb-3">
                            <strong>Status: </strong>
                            {hasWill ? "✅ Will Already Present" : "❌ No Will Found"}
                        </div>

                        {hasWill ? (
                            <div>
                                <p><strong>Transaction Hash:</strong> {transactionHash}</p>
                                <p>
                                    <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                                        🔗 View on Etherscan
                                    </a>
                                </p>
                            </div>
                        ) : (
                            <Button label="Create Will" onClick={createWill} />
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default WillPage;
