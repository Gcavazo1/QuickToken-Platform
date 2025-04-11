# QuickToken Smart Contract Documentation

## Overview
QuickToken is a customizable ERC-20 token implementation with advanced features including minting fees, time-lock mechanism, burnable functionality, and platform fee sharing. The contract is built on Solidity ^0.8.20 and inherits from OpenZeppelin's battle-tested contracts.

## Features

### 1. Time-Lock Mechanism
- Tokens are non-transferable for a specified duration after deployment
- Owner is exempt from time-lock restrictions
- Time-lock status can be queried using `getTimeUntilUnlock()`

### 2. Minting with Fees
- Customizable minting fee in wei
- Fee distribution between platform and owner
- Automatic excess ETH return
- Maximum supply limit enforcement

### 3. Platform Fee Sharing
- Configurable platform fee percentage
- Secure platform address management
- Platform can update its address
- Fee distribution events for transparency

### 4. Standard ERC-20 Features
- Full ERC-20 compliance
- Burnable functionality
- Transfer and approval mechanisms
- Balance and allowance tracking

## Technical Specification

### Contract Inheritance
```solidity
contract QuickToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard
```

### State Variables
- `maxSupply`: Maximum token supply (immutable)
- `mintFee`: Fee required for minting in wei (immutable)
- `unlockTime`: Timestamp when tokens become transferable (immutable)
- `platformFeeAddress`: Address receiving platform fees
- `platformFeePercentage`: Platform fee percentage (out of 100)

### Events
```solidity
event PlatformFeeUpdated(address indexed platformAddress, uint256 feePercentage)
event FeesDistributed(uint256 platformAmount, uint256 ownerAmount)
```

## Function Documentation

### Constructor
```solidity
constructor(
    string memory name_,
    string memory symbol_,
    uint256 maxSupply_,
    uint256 mintFee_,
    uint256 lockDuration,
    address platformAddress,
    uint256 platformPercentage
)
```
Initializes the token with:
- Token name and symbol
- Maximum supply limit
- Minting fee in wei
- Time-lock duration
- Platform fee configuration

### Minting
```solidity
function mint(address to, uint256 amount) public payable nonReentrant
```
Mints tokens with the following process:
1. Validates recipient address and supply limit
2. Calculates required fee: `(mintFee * amount) / 1e18`
3. Distributes fees between platform and owner
4. Returns excess ETH to sender
5. Mints tokens to recipient

Fee Distribution Formula:
```solidity
platformAmount = (requiredFee * platformFeePercentage) / 100
ownerAmount = requiredFee - platformAmount
```

### Platform Management
```solidity
function updatePlatformAddress(address newPlatformAddress) external
```
- Only callable by current platform address
- Updates platform fee recipient
- Emits PlatformFeeUpdated event

### Time-Lock Management
```solidity
function getTimeUntilUnlock() public view returns (uint256)
```
Returns remaining time until tokens become transferable:
- Returns 0 if time-lock has expired
- Returns seconds remaining if still locked

## Security Considerations

### Reentrancy Protection
- `nonReentrant` modifier on mint function
- State changes after external calls
- Proper order of operations

### Access Control
- Owner-only functions
- Platform address restrictions
- Zero address checks

### Fee Handling
- Secure fee calculation
- Proper ETH handling
- Excess return mechanism

## Usage Examples

### Deploying the Contract
```javascript
const QuickToken = await ethers.getContractFactory("QuickToken");
const token = await QuickToken.deploy(
    "QuickToken",
    "QTK",
    ethers.utils.parseEther("1000000"), // 1M tokens max supply
    ethers.utils.parseEther("0.1"),     // 0.1 ETH mint fee
    86400,                              // 24h lock duration
    platformAddress,
    20                                  // 20% platform fee
);
```

### Minting Tokens
```javascript
const amount = ethers.utils.parseEther("100");
const fee = amount.mul(mintFee).div(ethers.utils.parseEther("1"));
await token.mint(recipientAddress, amount, { value: fee });
```

### Checking Time-Lock
```javascript
const remainingTime = await token.getTimeUntilUnlock();
console.log(`Tokens unlock in ${remainingTime} seconds`);
```

## Gas Optimization

### Time-Lock Check
```solidity
bool isTransfer = from != address(0) && to != address(0);
bool isTimeLocked = block.timestamp < unlockTime;
```
- Combined conditions reduce gas costs
- Early returns for non-transfer cases

### Fee Calculation
- Efficient division operations
- Minimal state reads
- Optimized event emissions

## Error Handling

### Common Errors
- "Max supply must be positive"
- "Platform fee percentage cannot exceed 100%"
- "Platform address cannot be zero when fee percentage > 0"
- "Mint to the zero address"
- "Exceeds max supply"
- "Incorrect mint fee sent"
- "Transfers are time-locked"

## Events and Logging

### PlatformFeeUpdated
```solidity
event PlatformFeeUpdated(
    address indexed platformAddress,
    uint256 feePercentage
)
```
Emitted when platform address or fee percentage changes.

### FeesDistributed
```solidity
event FeesDistributed(
    uint256 platformAmount,
    uint256 ownerAmount
)
```
Emitted after successful fee distribution during minting.

## Best Practices

1. **Testing**
   - Test all edge cases
   - Verify fee calculations
   - Check time-lock behavior
   - Test access controls

2. **Deployment**
   - Verify constructor parameters
   - Double-check platform address
   - Test on testnet first
   - Monitor initial transactions

3. **Maintenance**
   - Monitor fee distribution
   - Track platform address changes
   - Verify time-lock expiration
   - Check supply limits

## License
UNLICENSED - Proprietary License
Copyright (c) 2023-2024 GigaCode (Gabriel Cavazos). All rights reserved. 