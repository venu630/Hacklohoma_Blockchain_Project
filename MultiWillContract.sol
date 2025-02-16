// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiWillContract {
    struct Beneficiary {
        address payable wallet;
        uint256 percentage; // ETH allocation percentage
        string saleDeedIpfsHash; // IPFS hash of the assigned sale deed
    }

    struct Will {
        address testator;
        uint256 totalLocked;
        uint256 lastAliveTime;
        uint256 proofOfLifeInterval;
        bool isDeceased;
        string notarizedWillIpfsHash;
        Beneficiary[] beneficiaries;
    }

    mapping(address => Will) private wills;
    mapping(address => bool) public hasWill;

    event WillCreated(address indexed testator, uint256 lockedFunds);
    event WillExecuted(address indexed testator);
    event ProofOfLifeConfirmed(address indexed testator);

    /**
     * @dev Creates a new will for the sender.
     * @param _proofOfLifeInterval Time interval in seconds to confirm alive.
     * @param _notarizedWillIpfsHash IPFS hash of the notarized will document.
     */
    function createWill(uint256 _proofOfLifeInterval, string memory _notarizedWillIpfsHash) public payable {
        require(!hasWill[msg.sender], "You already have a will!");
        require(msg.value > 0, "Must lock ETH!");

        wills[msg.sender].testator = msg.sender;
        wills[msg.sender].totalLocked = msg.value;
        wills[msg.sender].lastAliveTime = block.timestamp;
        wills[msg.sender].proofOfLifeInterval = _proofOfLifeInterval;
        wills[msg.sender].isDeceased = false;
        wills[msg.sender].notarizedWillIpfsHash = _notarizedWillIpfsHash;
        hasWill[msg.sender] = true;

        emit WillCreated(msg.sender, msg.value);
    }

    /**
     * @dev Adds a beneficiary to the caller's will.
     * @param _wallet Address of the beneficiary.
     * @param _percentage Share of ETH to be allocated.
     * @param _saleDeedIpfsHash IPFS hash of the sale deed document assigned to the beneficiary.
     */
    function addBeneficiary(address payable _wallet, uint256 _percentage, string memory _saleDeedIpfsHash) public {
        require(hasWill[msg.sender], "You need to create a will first");
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");

        uint256 totalPercentage = 0;
        for (uint i = 0; i < wills[msg.sender].beneficiaries.length; i++) {
            totalPercentage += wills[msg.sender].beneficiaries[i].percentage;
        }
        require(totalPercentage + _percentage <= 100, "Total allocation exceeds 100%");

        wills[msg.sender].beneficiaries.push(Beneficiary(_wallet, _percentage, _saleDeedIpfsHash));
    }

    /**
     * @dev Allows the owner to confirm they are alive.
     */
    function confirmAlive() public {
        require(hasWill[msg.sender], "No will found!");
        wills[msg.sender].lastAliveTime = block.timestamp;
        emit ProofOfLifeConfirmed(msg.sender);
    }

    /**
     * @dev Checks if a user's proof-of-life interval has expired and executes the will.
     */
    function checkDeath(address user) public {
        require(hasWill[user], "No will found!");
        require(block.timestamp > wills[user].lastAliveTime + wills[user].proofOfLifeInterval, "Owner is still alive!");

        wills[user].isDeceased = true;
        executeWill(user);
        emit WillExecuted(user);
    }

    /**
     * @dev Executes a will by distributing ETH to beneficiaries and unlocking sale deeds.
     */
    function executeWill(address user) internal {
        require(wills[user].isDeceased, "Will not executed yet");
        require(wills[user].totalLocked > 0, "No ETH in contract");

        for (uint i = 0; i < wills[user].beneficiaries.length; i++) {
            uint256 amount = (wills[user].totalLocked * wills[user].beneficiaries[i].percentage) / 100;
            wills[user].beneficiaries[i].wallet.transfer(amount);
        }

        wills[user].totalLocked = 0; // Clear locked funds after execution
    }

    /**
     * @dev Retrieves a user's notarized will IPFS hash.
     */
    function getNotarizedWill(address user) public view returns (string memory) {
        require(hasWill[user], "No will found!");
        require(wills[user].isDeceased, "Will has not been executed yet");
        return wills[user].notarizedWillIpfsHash;
    }

    /**
     * @dev Retrieves a specific beneficiary's assigned sale deed.
     */
    function getSaleDeed(address user, address _beneficiary) public view returns (string memory) {
        require(hasWill[user], "No will found!");
        require(wills[user].isDeceased, "Will has not been executed yet");

        for (uint i = 0; i < wills[user].beneficiaries.length; i++) {
            if (wills[user].beneficiaries[i].wallet == _beneficiary) {
                return wills[user].beneficiaries[i].saleDeedIpfsHash;
            }
        }
        revert("Beneficiary not found");
    }
}
