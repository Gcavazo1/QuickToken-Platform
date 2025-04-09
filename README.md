# QuickToken Kit

A professional-grade, customizable ERC-20 token smart contract toolkit designed for creators, small DAOs, and developers who want to launch their own token with passive income features.

![QuickToken Kit Banner](https://i.imgur.com/7lJGdnt.png)

## 🌟 Key Features

- **⚡ Ready for Deployment**: Complete ERC-20 token with all the features you need
- **💰 Built-in Passive Income**: Generate revenue through mint fees
- **🔒 Time-Lock Protection**: Prevent transfers until your specified time
- **🔥 Burning Support**: Allow reducing token supply for deflation
- **💼 Multi-Network Ready**: Deploy to Ethereum, Polygon, Optimism, Arbitrum, or Base
- **🛡️ Battle-Tested Base**: Built on OpenZeppelin contracts for maximum security
- **✅ Fully Tested**: Comprehensive test suite with 100% coverage
- **📄 Clean, Documented Code**: Easy to understand and customize

## 📋 Table of Contents

- [QuickToken Kit](#quicktoken-kit)
  - [Features](#-key-features)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Configuration](#-configuration)
  - [Deployment](#-deployment)
  - [Contract Functions](#-contract-functions)
  - [Monetization Strategy](#-monetization-strategy)
  - [Troubleshooting](#-troubleshooting)
  - [Customization Guide](#-customization-guide)
  - [License](#-license)

## 📚 Prerequisites

- Node.js v16 or later
- NPM or Yarn
- Basic knowledge of smart contracts
- Wallet with network tokens for deployment (ETH, MATIC, etc.)
- Infura account (free tier is sufficient)

## 🚀 Installation

1. Clone this repository
```bash
git clone https://github.com/YourUsername/QuickToken-Kit.git
cd QuickToken-Kit
```

2. Install dependencies
```bash
npm install
```

3. Configure your environment variables by creating a `.env` file (see [Configuration](#-configuration))

4. Compile the contracts
```bash
npx hardhat compile
```

5. Run tests to ensure everything is working correctly
```bash
npx hardhat test
```

## ⚙️ Configuration

1. Create a `.env` file in the project root with the following variables:

```
# Network URLs (From your Infura dashboard)
INFURA_API_KEY=your_infura_api_key_here

# Deployment Wallet (The private key of the wallet you'll use to deploy)
PRIVATE_KEY=your_wallet_private_key_here_without_0x_prefix

# Optional: Explorer API Keys (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

2. Customize your token parameters in `scripts/deploy.js`:

- `tokenName`: The name of your token (e.g., "MyAwesomeToken")
- `tokenSymbol`: The symbol for your token (e.g., "MAT")
- `maxSupply`: Maximum total supply of tokens
- `mintFee`: Fee charged per token (in native currency)
- `lockDuration`: Time period tokens cannot be transferred after deployment

For example:
```javascript
const tokenName = "MyAwesomeToken";
const tokenSymbol = "MAT";
const maxSupply = ethers.parseUnits("10000000", 18); // 10 Million tokens
const mintFee = ethers.parseEther("0.001"); // 0.001 ETH/MATIC/etc per token
const lockDuration = 60 * 60 * 24 * 30; // 30 days lock duration
```

## 📡 Deployment

### Network Selection Guide

| Network | Pros | Cons | Recommended For |
|---------|------|------|-----------------|
| Ethereum Mainnet | Highest prestige, security | Very high gas fees | Established projects with funding |
| Polygon | Low fees, large user base | More competition | Most projects seeking adoption |
| Optimism | Growing ecosystem, Ethereum security | Medium fees | DeFi-focused projects |
| Arbitrum | Fast, Ethereum security | Medium adoption | Technical applications |
| Base | Coinbase backing, growing rapidly | Newer ecosystem | Consumer-focused applications |

### Deployment Commands

Deploy to Ethereum Mainnet:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

Deploy to Polygon (recommended for most users):
```bash
npx hardhat run scripts/deploy.js --network polygon
```

Deploy to Optimism:
```bash
npx hardhat run scripts/deploy.js --network optimism
```

Deploy to Arbitrum:
```bash
npx hardhat run scripts/deploy.js --network arbitrum
```

Deploy to Base:
```bash
npx hardhat run scripts/deploy.js --network base
```

### Verify Your Contract (Optional but Recommended)

After deployment, verify your contract to make it transparent to users:

```bash
npx hardhat verify --network NETWORK_NAME DEPLOYED_CONTRACT_ADDRESS "TokenName" "TKN" "TOTAL_SUPPLY" "MINT_FEE" "LOCK_DURATION"
```

Replace the placeholders with your actual values. For example:
```bash
npx hardhat verify --network polygon 0x1234567890AbCdEf1234567890AbCdEf12345678 "MyAwesomeToken" "MAT" "10000000000000000000000000" "1000000000000000" "2592000" 
```

## 📝 Contract Functions

### For Token Holders

- `mint(address to, uint256 amount)`: Mint new tokens by paying the required fee
- `burn(uint256 amount)`: Burn your own tokens
- `burnFrom(address account, uint256 amount)`: Burn tokens from an account that has approved you
- `transfer(address to, uint256 amount)`: Transfer tokens
- `approve(address spender, uint256 amount)`: Approve another address to spend your tokens

### For Token Owners

- `owner()`: View the contract owner address
- `transferOwnership(address newOwner)`: Transfer ownership to a new address

### View Functions

- `getTimeUntilUnlock()`: Get the remaining time until transfers are unlocked
- `maxSupply()`: Get the maximum possible supply
- `mintFee()`: Get the fee required to mint one token
- `unlockTime()`: Get the timestamp when transfers will be unlocked
- `calculateMintFee(uint256 amount)`: Calculate the fee for minting a specific amount

## 💸 Monetization Strategy

The QuickToken contract includes multiple ways to generate passive income:

### 1. **Token Mint Fees** (Built-in)
Set your desired mint fee - every time someone mints your token, you automatically receive the fee.

**Optimization Tips:**
- On Ethereum: 0.01-0.05 ETH per token (higher value, higher gas)
- On Polygon: 0.001-0.005 MATIC per token (lower value, higher volume)
- On Optimism/Arbitrum/Base: 0.002-0.01 ETH per token (medium value, medium volume)

### 2. **Initial Token Distribution**
Mint some tokens for yourself during deployment and sell them:
- Through pre-sales
- On DEXs by creating liquidity pools
- Directly to community members

### 3. **Marketing and Ecosystem Building**
- Add utility to your token to increase demand
- Create DeFi products around your token
- Build a community to drive adoption

## ❓ Troubleshooting

### Common Issues and Solutions

#### Deployment Failures

**Issue**: Insufficient funds for gas
**Solution**: Ensure your wallet has enough native tokens for the selected network

**Issue**: Nonce too high/low
**Solution**: Reset your MetaMask account's transaction history or use a specific nonce

**Issue**: Error with constructor arguments
**Solution**: Double-check the format of your constructor arguments, especially for large numbers

#### Contract Verification Failures

**Issue**: "Contract source code not verified"
**Solution**: Ensure you're passing the exact same arguments used during deployment

**Issue**: "Bytecode doesn't match"
**Solution**: Check that your verification command includes all constructor parameters in the correct order

#### Network Connection Issues

**Issue**: "Could not connect to the network"
**Solution**: Check your Infura API key and ensure you have access to the chosen network

#### Transaction Error: "Gas estimation failed"

**Solution**: 
1. Your function might be reverting - check your parameters
2. Try increasing the gas limit manually
3. For mint functions, ensure you're sending the exact correct fee

## 🛠️ Customization Guide

### Custom Token Features

You can customize your token by modifying `contracts/QuickToken.sol`:

#### Adding Token Vesting
```solidity
// Add to your contract
mapping(address => uint256) public vestingTimestamps;

function createVesting(address beneficiary, uint256 releaseTime) external onlyOwner {
    vestingTimestamps[beneficiary] = releaseTime;
}

// Override the _beforeTokenTransfer function to include vesting
function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
    super._beforeTokenTransfer(from, to, amount);
    
    // Apply time lock
    if (from != owner() && to != owner() && block.timestamp < unlockTime) {
        require(false, "Transfers are time-locked");
    }
    
    // Apply vesting
    if (vestingTimestamps[from] > 0) {
        require(block.timestamp >= vestingTimestamps[from], "Tokens are still vesting");
    }
}
```

#### Adding an Airdrop Feature
```solidity
function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
    require(recipients.length == amounts.length, "Arrays must be the same length");
    
    for (uint i = 0; i < recipients.length; i++) {
        _mint(recipients[i], amounts[i]);
    }
}
```

### Additional Networks

To add support for more networks, update your `hardhat.config.js` file:

```javascript
// Example: Add zkSync Era
zkSync: {
    url: `https://mainnet.era.zksync.io`,
    accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
    chainId: 324
}
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️ by [Your Name/Company]

For support or inquiries, contact: [your email/contact info] 