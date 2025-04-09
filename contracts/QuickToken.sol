// SPDX-License-Identifier: UNLICENSED
// QuickToken Kit - Proprietary License
// Copyright (c) 2023 GigaCode (Gabriel Cavazos). All rights reserved.
// This code is licensed under a proprietary license. See LICENSE file for details.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // Corrected path for v4.x

/**
 * @title QuickToken
 * @dev A customizable ERC-20 token with minting fees, time-lock, and burnable features.
 */
contract QuickToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public immutable mintFee;
    uint256 public immutable unlockTime; // Timestamp when tokens become transferable

    /**
     * @dev Sets the values for {name}, {symbol}, initial owner, max supply, mint fee, and lock duration.
     * The full maxSupply is minted to the contract deployer upon creation.
     * @param name_ The name of the token.
     * @param symbol_ The symbol of the token.
     * @param maxSupply_ The maximum total supply of the token.
     * @param mintFee_ The fee required in wei to mint new tokens (0 for no fee).
     * @param lockDuration The duration in seconds from deployment during which tokens are non-transferable.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 mintFee_,
        uint256 lockDuration
    ) ERC20(name_, symbol_) Ownable(/* Removed initialOwner */) {
        require(maxSupply_ > 0, "QuickToken: Max supply must be positive");
        maxSupply = maxSupply_;
        mintFee = mintFee_;
        unlockTime = block.timestamp + lockDuration;

        // NOTE: Initial supply is 0. Tokens are minted via the mint() function.
        // _mint(msg.sender, maxSupply_); // Removed initial mint to deployer
    }

    // --- Core Functions ---

    /**
     * @dev Mints `amount` tokens to `to`, requiring payment of `mintFee` * `amount` / 10^18 if `mintFee` > 0.
     * This scales the fee calculation to account for token decimals.
     * Fees are forwarded to the contract owner.
     * Emits a {Transfer} event.
     * Requirements:
     * - `to` cannot be the zero address.
     * - The caller must send the correct fee if `mintFee` is set.
     * - `totalSupply() + amount` must not exceed `maxSupply`.
     */
    function mint(address to, uint256 amount) public payable nonReentrant {
        require(to != address(0), "ERC20: mint to the zero address");
        require(totalSupply() + amount <= maxSupply, "QuickToken: Exceeds max supply");

        if (mintFee > 0) {
            // Calculate fee based on token amount (scaled to account for decimals)
            // For example, if mintFee is 0.01 ETH and amount is 100 tokens (100 * 10^18),
            // we want to charge 1 ETH (100 * 0.01), not 100 * 10^18 * 0.01.
            uint256 requiredFee = (mintFee * amount) / 1e18;
            require(msg.value == requiredFee, "QuickToken: Incorrect mint fee sent");

            // Forward the fee to the owner
            if (requiredFee > 0) {
                (bool success, ) = owner().call{value: requiredFee}("");
                require(success, "QuickToken: Fee transfer failed");
            }
        }

        _mint(to, amount);
    }

    // --- Time Lock Logic ---

    /**
     * @dev Hook that is called before any transfer of tokens.
     * Prevents transfers until the unlock time is reached, except for the owner.
     * Minting (when from is address(0)) is still allowed during the time lock period.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        // Check if it's a transfer (not minting or burning)
        // Minting: from is address(0)
        // Burning: to is address(0)
        bool isTransfer = from != address(0) && to != address(0);
        
        // Only apply time lock for transfers, not minting/burning
        // Allow owner to transfer anytime, allow anyone after unlockTime
        if (isTransfer && from != owner() && to != owner() && block.timestamp < unlockTime) {
            require(false, "QuickToken: Transfers are time-locked");
        }
    }

    // --- View Functions ---

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
} 