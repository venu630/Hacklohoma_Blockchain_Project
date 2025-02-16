// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiWillContract {
    struct Beneficiary {
        address payable wallet;
        uint256 percentage; // ETH allocation percentage
        string saleDeedIpfsHash; // IPFS hash of the assigned sale deed
        string email; // Beneficiary's email
    }

    struct Will {
        address testator;
        string firstName;
        string lastName;
        uint256 totalLocked;
        uint256 lastAliveTime;
        uint256 proofOfLifeInterval;
        bool isDeceased;
        bytes32 transactionHash; // Stores the transaction hash of createWill()
        Beneficiary[] beneficiaries;
    }

    mapping(address => Will) private wills;
    mapping(address => bool) public hasWill;

    event WillCreated(address indexed testator, uint256 lockedFunds, bytes32 transactionHash);
    event BeneficiaryAdded(address indexed testator, address beneficiary, uint256 percentage);
    event WillExecuted(address indexed testator);
    event FundsDisbursed(address indexed beneficiary, uint256 amount, string saleDeedIpfsHash, string email);

    /**
     * @dev Creates a new will for the sender.
     * @param _firstName First name of the testator.
     * @param _lastName Last name of the testator.
     */
    function createWill(
        string memory _firstName,
        string memory _lastName
    ) public payable {
        require(!hasWill[msg.sender], "You already have a will!");
        require(msg.value > 0, "Must lock ETH!");

        // Generate a pseudo transaction hash (since Solidity can't access actual tx hashes)
        bytes32 txnHash = keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender));

        // Store will details
        wills[msg.sender].testator = msg.sender;
        wills[msg.sender].firstName = _firstName;
        wills[msg.sender].lastName = _lastName;
        wills[msg.sender].totalLocked = msg.value;
        wills[msg.sender].lastAliveTime = block.timestamp;
        wills[msg.sender].proofOfLifeInterval = 365 days; // Default 1-year proof-of-life check
        wills[msg.sender].isDeceased = false;
        wills[msg.sender].transactionHash = txnHash;
        hasWill[msg.sender] = true;

        emit WillCreated(msg.sender, msg.value, txnHash);
    }

    /**
     * @dev Adds a beneficiary to the caller's will.
     * @param _wallet Address of the beneficiary.
     * @param _percentage Share of ETH to be allocated.
     * @param _saleDeedIpfsHash IPFS hash of the sale deed document assigned to the beneficiary.
     * @param _email Email of the beneficiary.
     */
    function addBeneficiary(
        address payable _wallet,
        uint256 _percentage,
        string memory _saleDeedIpfsHash,
        string memory _email
    ) public {
        require(hasWill[msg.sender], "You need to create a will first");
        require(_wallet != address(0), "Invalid wallet address");
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");

        uint256 totalPercentage = 0;
        for (uint i = 0; i < wills[msg.sender].beneficiaries.length; i++) {
            totalPercentage += wills[msg.sender].beneficiaries[i].percentage;
        }
        require(totalPercentage + _percentage <= 100, "Total allocation exceeds 100%");

        wills[msg.sender].beneficiaries.push(
            Beneficiary(_wallet, _percentage, _saleDeedIpfsHash, _email)
        );

        emit BeneficiaryAdded(msg.sender, _wallet, _percentage);
    }

    /**
     * @dev Confirms the testator is alive.
     */
    function confirmAlive() public {
        require(hasWill[msg.sender], "You have not created a will");
        require(!wills[msg.sender].isDeceased, "Will already executed!");

        wills[msg.sender].lastAliveTime = block.timestamp;
    }

    /**
     * @dev Executes the will by distributing ETH and notifying beneficiaries.
     */
    function executeWill(address user) public {
        require(hasWill[user], "No will found!");
        require(block.timestamp > wills[user].lastAliveTime + wills[user].proofOfLifeInterval, "Owner is still alive!");
        require(!wills[user].isDeceased, "Will already executed!");

        wills[user].isDeceased = true;

        uint256 totalLocked = wills[user].totalLocked;
        require(totalLocked > 0, "No ETH to distribute");

        for (uint i = 0; i < wills[user].beneficiaries.length; i++) {
            Beneficiary storage beneficiary = wills[user].beneficiaries[i];

            uint256 amount = (totalLocked * beneficiary.percentage) / 100;
            beneficiary.wallet.transfer(amount);

            emit FundsDisbursed(beneficiary.wallet, amount, beneficiary.saleDeedIpfsHash, beneficiary.email);
        }

        wills[user].totalLocked = 0;
        emit WillExecuted(user);
    }

    /**
     * @dev Retrieves the transaction hash of a user's will.
     */
    function getWillTransactionHash(address user) public view returns (bytes32) {
        require(hasWill[user], "No will found!");
        return wills[user].transactionHash;
    }
}
