const ethers = require("ethers");
require("dotenv").config();

const contractABI = [
  "event FundsDisbursed(address indexed beneficiary, uint256 amount, string saleDeedIpfsHash, string email)",
];

const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_NODE_URL
);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function notifyBeneficiary(
  beneficiary,
  amount,
  saleDeedIpfsHash,
  email,
  event
) {
  try {
    const response = await fetch("http://localhost:3000/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        beneficiaryName: `${beneficiary.slice(0, 6)}...${beneficiary.slice(
          -4
        )}`,
        beneficiaryEmail: email,
        testatorName: "Estate Owner",
        ethAmount: ethers.utils.formatEther(amount),
        transactionHash: event.transactionHash,
        saleDeedName: "Property Deed Document",
        saleDeedIPFSHash: saleDeedIpfsHash,
      }),
    });

    const result = await response.json();
    console.log("Email notification sent:", result);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

// Start listening to events
contract.on(
  "FundsDisbursed",
  async (beneficiary, amount, saleDeedIpfsHash, email, event) => {
    console.log(`
    New will execution detected:
    Beneficiary: ${beneficiary}
    Amount: ${ethers.utils.formatEther(amount)} ETH
    IPFS Hash: ${saleDeedIpfsHash}
    Email: ${email}
    Transaction: ${event.transactionHash}
  `);

    await notifyBeneficiary(
      beneficiary,
      amount,
      saleDeedIpfsHash,
      email,
      event
    );
  }
);

console.log("Listening for FundsDisbursed events...");
