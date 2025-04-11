// SPDX-License-Identifier: UNLICENSED
// QuickToken Platform - Proprietary License
// Copyright (c) 2023-2024 GigaCode (Gabriel Cavazos). All rights reserved.
// This code is licensed under a proprietary license. See LICENSE file for details.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title QuickToken
 * @dev A customizable ERC-20 token with minting fees, time-lock, burnable features, and platform fee sharing.
 */
contract QuickToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public immutable mintFee;
    uint256 public immutable unlockTime; // Timestamp when tokens become transferable
    
    // Platform fee configuration
    address public platformFeeAddress;
    uint256 public platformFeePercentage; // out of 100 (e.g., 20 for 20%)
    
    // Events
    event PlatformFeeUpdated(address indexed platformAddress, uint256 feePercentage);
    event FeesDistributed(uint256 platformAmount, uint256 ownerAmount);

    /**
     * @dev Sets the values for {name}, {symbol}, initial owner, max supply, mint fee, lock duration,
     * and platform fee configuration.
     * @param name_ The name of the token.
     * @param symbol_ The symbol of the token.
     * @param maxSupply_ The maximum total supply of the token.
     * @param mintFee_ The fee required in wei to mint new tokens (0 for no fee).
     * @param lockDuration The duration in seconds from deployment during which tokens are non-transferable.
     * @param platformAddress The address that receives platform fees.
     * @param platformPercentage The percentage of mint fees allocated to the platform (out of 100).
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 mintFee_,
        uint256 lockDuration,
        address platformAddress,
        uint256 platformPercentage
    ) ERC20(name_, symbol_) Ownable() {
        // Basic validation
        require(maxSupply_ > 0, "Max supply must be positive");
        require(platformPercentage <= 100, "Platform fee percentage cannot exceed 100%");
        
        // Only validate platform address if fee percentage is set
        if (platformPercentage > 0) {
            require(platformAddress != address(0), "Platform address cannot be zero when fee percentage > 0");
        }
        
        maxSupply = maxSupply_;
        mintFee = mintFee_;
        unlockTime = block.timestamp + lockDuration;
        
        // Set platform fee configuration
        platformFeeAddress = platformAddress;
        platformFeePercentage = platformPercentage;
        
        if (platformFeeAddress != address(0)) {
            emit PlatformFeeUpdated(platformFeeAddress, platformFeePercentage);
        }
    }

    /**
     * @dev Mints `amount` tokens to `to`, requiring payment of `mintFee` * `amount` / 10^18 if `mintFee` > 0.
     * Fees are split between the platform and contract owner according to platformFeePercentage.
     * Emits a {Transfer} event.
     */
    function mint(address to, uint256 amount) public payable nonReentrant {
        require(to != address(0), "Mint to the zero address");
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");

        if (mintFee > 0) {
            // Calculate fee based on token amount (scaled to account for decimals)
            uint256 requiredFee = (mintFee * amount) / 1e18;
            require(msg.value >= requiredFee, "Incorrect mint fee sent");

            // If there's a fee to distribute
            if (requiredFee > 0) {
                // Calculate platform and owner portions
                uint256 platformAmount = 0;
                uint256 ownerAmount = requiredFee;
                
                // Only distribute to platform if platformFeePercentage > 0 and platformFeeAddress is set
                if (platformFeePercentage > 0 && platformFeeAddress != address(0)) {
                    platformAmount = (requiredFee * platformFeePercentage) / 100;
                    ownerAmount = requiredFee - platformAmount;
                    
                    // Transfer platform fee
                    if (platformAmount > 0) {
                        (bool platformSuccess, ) = platformFeeAddress.call{value: platformAmount}("");
                        require(platformSuccess, "Platform fee transfer failed");
                    }
                }
                
                // Transfer owner fee
                if (ownerAmount > 0) {
                    (bool ownerSuccess, ) = owner().call{value: ownerAmount}("");
                    require(ownerSuccess, "Owner fee transfer failed");
                }
                
                emit FeesDistributed(platformAmount, ownerAmount);
            }
            
            // Return excess ETH if more was sent than needed
            uint256 excess = msg.value - requiredFee;
            if (excess > 0) {
                (bool returnSuccess, ) = msg.sender.call{value: excess}("");
                require(returnSuccess, "Return of excess ETH failed");
            }
        }

        _mint(to, amount);
    }

    /**
     * @dev Updates the platform fee address.
     * Only the platform fee address can call this function.
     * @param newPlatformAddress The new platform fee recipient address.
     */
    function updatePlatformAddress(address newPlatformAddress) external {
        require(msg.sender == platformFeeAddress, "Only platform can update its address");
        require(newPlatformAddress != address(0), "New platform address cannot be zero");
        
        platformFeeAddress = newPlatformAddress;
        emit PlatformFeeUpdated(platformFeeAddress, platformFeePercentage);
    }

    /**
     * @dev Hook that is called before any transfer of tokens.
     * Prevents transfers until the unlock time is reached, except for the owner.
     * Gas optimized to reduce conditional operations.
     */
    function _beforeTokenTransfer(
        address from, 
        address to, 
        uint256 amount
    ) internal virtual override {
        // Optimize gas by calculating conditions once and combining checks
        bool isTransfer = from != address(0) && to != address(0);
        bool isTimeLocked = block.timestamp < unlockTime;
        
        if (isTransfer && isTimeLocked && from != owner() && to != owner()) {
            revert("Transfers are time-locked");
        }
        
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Returns the remaining time in seconds until tokens become transferable.
     */
    function getTimeUntilUnlock() public view returns (uint256) {
        if (block.timestamp >= unlockTime) {
            return 0;
        }
        return unlockTime - block.timestamp;
    }

    /**
     * @dev Returns the required fee to mint the given amount of tokens
     */
    function calculateMintFee(uint256 amount) public view returns (uint256) {
        return (mintFee * amount) / 1e18;
    }
    
    /**
     * @dev Calculates how mint fees will be distributed between platform and owner.
     */
    function calculateFeeDistribution(uint256 amount) public view returns (
        uint256 totalFee, 
        uint256 platformAmount, 
        uint256 ownerAmount
    ) {
        totalFee = calculateMintFee(amount);
        
        if (platformFeePercentage > 0 && platformFeeAddress != address(0)) {
            platformAmount = (totalFee * platformFeePercentage) / 100;
            ownerAmount = totalFee - platformAmount;
        } else {
            platformAmount = 0;
            ownerAmount = totalFee;
        }
        
        return (totalFee, platformAmount, ownerAmount);
    }
} 