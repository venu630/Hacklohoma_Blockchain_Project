// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Smart Will Contract
 * @dev This contract allows a user to create a digital will that distributes ETH and sale deed documents upon death verification.
 */
contract WillContract {
    address public owner; // The person creating the will
    uint public lastAliveTime; // Timestamp of last proof-of-life confirmation
    uint public proofOfLifeInterval; // Time interval required for the owner to confirm they are alive
    bool public isDeceased; // Flag indicating if the owner is confirmed deceased

    // Struct to store beneficiary details
    struct Beneficiary {
        address payable wallet; // Beneficiary's wallet address
        uint256 percentage; // Share of ETH the beneficiary will receive
        string saleDeedIpfsHash; // IPFS hash of the assigned sale deed document
    }

    Beneficiary[] public beneficiaries; // List of all beneficiaries
    uint256 public totalLocked; // Total ETH locked in the contract

    string public notarizedWillIpfsHash; // IPFS hash of the legally notarized will document

    /**
     * @dev Contract constructor initializes the will.
     * @param _proofOfLifeInterval Time in seconds the owner must confirm alive (e.g., 3 months = 7,776,000 seconds).
     * @param _notarizedWillIpfsHash IPFS hash of the notarized will document.
     */
    constructor(uint _proofOfLifeInterval, string memory _notarizedWillIpfsHash) payable {
        owner = msg.sender; // Assign contract creator as the will owner
        proofOfLifeInterval = _proofOfLifeInterval; // Set proof-of-life interval
        lastAliveTime = block.timestamp; // Set the initial alive timestamp
        totalLocked = msg.value; // Store the initial deposited ETH
        notarizedWillIpfsHash = _notarizedWillIpfsHash; // Store IPFS hash of the notarized will document
    }

    /**
     * @dev Adds a new beneficiary to the will.
     * @param _wallet Address of the beneficiary.
     * @param _percentage Share of ETH to be allocated to the beneficiary.
     * @param _saleDeedIpfsHash IPFS hash of the sale deed document assigned to the beneficiary.
     */
    function addBeneficiary(address payable _wallet, uint256 _percentage, string memory _saleDeedIpfsHash) public {
        require(msg.sender == owner, "Only the owner can add beneficiaries");
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");

        // Ensure total assigned percentages do not exceed 100%
        uint256 totalPercentage = 0;
        for (uint i = 0; i < beneficiaries.length; i++) {
            totalPercentage += beneficiaries[i].percentage;
        }
        require(totalPercentage + _percentage <= 100, "Total allocation exceeds 100%");

        // Add new beneficiary to the list
        beneficiaries.push(Beneficiary(_wallet, _percentage, _saleDeedIpfsHash));
    }

    /**
     * @dev Allows the owner to confirm they are alive.
     * This resets the proof-of-life timer.
     */
    function confirmAlive() public {
        require(msg.sender == owner, "Only the owner can confirm alive");
        lastAliveTime = block.timestamp; // Updates the timestamp to current time
    }

    /**
     * @dev Checks if the owner has failed to confirm alive within the set interval.
     * If so, triggers the execution of the will.
     */
    function checkDeath() public {
        require(block.timestamp > lastAliveTime + proofOfLifeInterval, "Owner is still alive");
        isDeceased = true;
        executeWill(); // Call will execution function
    }

    /**
     * @dev Executes the will by distributing ETH to beneficiaries and providing access to sale deeds.
     */
    function executeWill() internal {
        require(isDeceased, "Owner is still alive");
        require(totalLocked > 0, "No ETH in contract");

        // Distribute ETH to beneficiaries based on their percentage
        for (uint i = 0; i < beneficiaries.length; i++) {
            uint256 amount = (totalLocked * beneficiaries[i].percentage) / 100;
            beneficiaries[i].wallet.transfer(amount);
        }

        // Clear contract balance after distribution
        totalLocked = 0;
    }

    /**
     * @dev Allows a beneficiary to retrieve their assigned sale deed IPFS hash.
     * @param _beneficiary Address of the beneficiary requesting the document.
     * @return IPFS hash of the sale deed document.
     */
    function getSaleDeed(address _beneficiary) public view returns (string memory) {
        require(isDeceased, "Will has not been executed yet");

        // Find the beneficiary and return the corresponding sale deed hash
        for (uint i = 0; i < beneficiaries.length; i++) {
            if (beneficiaries[i].wallet == _beneficiary) {
                return beneficiaries[i].saleDeedIpfsHash; // Return only their assigned document
            }
        }

        revert("Beneficiary not found");
    }

    /**
     * @dev Retrieves the notarized will document's IPFS hash.
     * @return IPFS hash of the notarized will document.
     */
    function getNotarizedWill() public view returns (string memory) {
        require(isDeceased, "Will has not been executed yet");
        return notarizedWillIpfsHash;
    }

    /**
     * @dev Retrieves the current contract balance.
     * @return Total ETH stored in the contract.
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
