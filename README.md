# QuickToken Kit

A professional-grade, customizable ERC-20 token smart contract toolkit designed for creators, small DAOs, and developers who want to launch their own token with passive income features.

![GigaCode QuickToken Kit](https://raw.githubusercontent.com/Gcavazo1/QuickToken-Kit/master/assets/GigaCode_Logo.png)

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
  - [Detailed Setup Guide](#-detailed-setup-guide)
  - [Configuration](#-configuration)
  - [Token Customization](#-token-customization)
  - [Deployment](#-deployment)
  - [Interacting With Your Token](#-interacting-with-your-token)
  - [Contract Functions](#-contract-functions)
  - [Monetization Strategy](#-monetization-strategy)
  - [Advanced Features](#-advanced-features)
  - [Example Use Cases](#-example-use-cases)
  - [Testing Guide](#-testing-guide)
  - [Troubleshooting](#-troubleshooting)
  - [Customization Guide](#-customization-guide)
  - [License](#-license)

## 📚 Prerequisites

- Node.js v16 or later
- NPM or Yarn
- Basic knowledge of smart contracts
- Wallet with network tokens for deployment (ETH, MATIC, etc.)
- Infura account (free tier is sufficient)
- MetaMask or similar wallet for testing and deployment

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

## 🔍 Detailed Setup Guide

### Creating an Infura Account

1. Visit [Infura.io](https://infura.io) and sign up for a free account
2. Click "Create New Project"
3. Select "Web3 API" as the product and name your project (e.g., "QuickToken")
4. Once created, find your "Project ID" (this is your Infura API Key)
5. Copy this ID to use in your `.env` file

### Setting Up MetaMask

1. Install the [MetaMask browser extension](https://metamask.io/download.html)
2. Create a new wallet or import an existing one
3. To get your private key (needed for deployment):
   - Click on the account icon
   - Go to "Account Details"
   - Click "Export Private Key" (enter your password)
   - Copy the private key (remove the "0x" prefix when adding to `.env`)

### Getting Test Tokens

For testing on testnets before deploying to mainnet:

- **Ethereum Sepolia**: Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- **Polygon Mumbai**: Visit [Polygon Faucet](https://faucet.polygon.technology/)
- **Base Goerli**: Visit [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

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

2. Getting verification API keys (optional but recommended):
   - For Etherscan: Create an account at [etherscan.io](https://etherscan.io), go to your profile and create an API key
   - For Polygonscan: Create an account at [polygonscan.com](https://polygonscan.com), go to your profile and create an API key

## 🎛️ Token Customization

You can fully customize your token by modifying the parameters in `scripts/deploy.js`:

### Basic Parameters

```javascript
// In scripts/deploy.js
const tokenName = "MyAwesomeToken";       // Your token's name
const tokenSymbol = "MAT";                // Your token's symbol (2-6 characters recommended)
const maxSupply = ethers.parseUnits("10000000", 18); // Maximum total supply (with 18 decimals)
const mintFee = ethers.parseEther("0.001"); // Fee to mint each token
const lockDuration = 60 * 60 * 24 * 30;   // Time lock in seconds (30 days in this example)
```

### Understanding the Parameters

| Parameter | Description | Recommended Values |
|-----------|-------------|-------------------|
| `tokenName` | Full name of your token | Make it memorable, descriptive |
| `tokenSymbol` | Trading symbol | 2-6 characters, all caps |
| `maxSupply` | Maximum tokens that can exist | Consider your tokenomics (1M-1B common) |
| `mintFee` | Fee to mint 1 token | Varies by network (see [Monetization](#-monetization-strategy)) |
| `lockDuration` | Period tokens are non-transferable | 0 (no lock) to several months (in seconds) |

### Customization Examples

**Community Token**:
```javascript
const tokenName = "Community Points";
const tokenSymbol = "CPTS";
const maxSupply = ethers.parseUnits("1000000", 18); // 1 Million
const mintFee = ethers.parseEther("0.0001"); // Low fee for community adoption
const lockDuration = 0; // No lock for immediate use
```

**Investment Token**:
```javascript
const tokenName = "Yield Generator";
const tokenSymbol = "YIELD";
const maxSupply = ethers.parseUnits("10000", 18); // Limited supply
const mintFee = ethers.parseEther("0.01"); // Higher fee
const lockDuration = 60 * 60 * 24 * 90; // 90-day lock
```

## 📡 Deployment

### Step-by-Step Deployment Guide

#### 1. Choose a Network for Deployment

First, decide which network to deploy to based on your needs (see [Network Selection Guide](#network-selection-guide)).

#### 2. Ensure Your Wallet Has Funds

Make sure your wallet has enough native tokens for the network you're deploying to:
- Ethereum: 0.05-0.1 ETH
- Polygon: 1-2 MATIC
- Other networks: Similar small amounts

#### 3. Configure Your Token Parameters

Update the parameters in `scripts/deploy.js` as shown in the [Token Customization](#-token-customization) section.

#### 4. Deploy Your Token

Run the deployment command for your chosen network:

```bash
# For Ethereum Mainnet
npx hardhat run scripts/deploy.js --network mainnet

# For Polygon (recommended for most users)
npx hardhat run scripts/deploy.js --network polygon

# For testnets (safer for first deployment)
npx hardhat run scripts/deploy.js --network sepolia
```

#### 5. Save Your Contract Address

When deployment succeeds, you'll see a message like:
```
QuickToken deployed to: 0x1234...5678
```

Save this address! You'll need it to interact with your token.

#### 6. Verify Your Contract (Optional but Recommended)

```bash
npx hardhat verify --network polygon 0xYOUR_CONTRACT_ADDRESS "TokenName" "TKN" "TOTAL_SUPPLY" "MINT_FEE" "LOCK_DURATION"
```

Replace the values with your actual parameters. For example:
```bash
npx hardhat verify --network polygon 0x1234567890AbCdEf1234567890AbCdEf12345678 "MyAwesomeToken" "MAT" "10000000000000000000000000" "1000000000000000" "2592000" 
```

### Network Selection Guide

| Network | Pros | Cons | Recommended For |
|---------|------|------|-----------------|
| Ethereum Mainnet | Highest prestige, security | Very high gas fees | Established projects with funding |
| Polygon | Low fees, large user base | More competition | Most projects seeking adoption |
| Optimism | Growing ecosystem, Ethereum security | Medium fees | DeFi-focused projects |
| Arbitrum | Fast, Ethereum security | Medium adoption | Technical applications |
| Base | Coinbase backing, growing rapidly | Newer ecosystem | Consumer-focused applications |

## 🔄 Interacting With Your Token

### Using MetaMask (for Basic Interactions)

1. **Add Your Token to MetaMask**:
   - Open MetaMask
   - Scroll down and click "Import tokens"
   - Enter your token's contract address
   - Symbol and Decimals (18) should auto-fill
   - Click "Add Custom Token"

2. **Checking Your Balance**:
   - Once added, your token balance will appear in MetaMask

3. **Transferring Tokens**:
   - Click on your token
   - Click "Send"
   - Enter recipient address and amount
   - Confirm the transaction

### Using Etherscan/Polygonscan (for Advanced Interactions)

1. **Search for Your Contract**:
   - Go to the explorer for your network (e.g., [polygonscan.com](https://polygonscan.com))
   - Enter your contract address in the search bar

2. **Interact With Contract Functions**:
   - Go to the "Contract" tab
   - Click "Write Contract" or "Read Contract"
   - Connect your wallet when prompted
   - Select the function you want to use (e.g., mint, burn)
   - Enter the parameters and execute

### Example JavaScript for Programmatic Interaction

```javascript
// Example script to interact with your token (Node.js)
const { ethers } = require("ethers");
require('dotenv').config();

async function interactWithToken() {
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
  );
  
  // Create a signer
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  // The contract address and ABI
  const tokenAddress = "YOUR_TOKEN_ADDRESS_HERE";
  const tokenABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function mint(address to, uint256 amount) payable",
    "function burn(uint256 amount)",
  ];
  
  // Create a contract instance
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  
  // Get balance
  const balance = await tokenContract.balanceOf(signer.address);
  console.log(`Token balance: ${ethers.utils.formatUnits(balance, 18)}`);
  
  // Mint tokens (requires sending the mint fee)
  const mintAmount = ethers.utils.parseUnits("1", 18); // 1 token
  const mintFee = await tokenContract.calculateMintFee(mintAmount);
  await tokenContract.mint(signer.address, mintAmount, { value: mintFee });
  
  // Transfer tokens
  const recipient = "RECIPIENT_ADDRESS";
  const transferAmount = ethers.utils.parseUnits("0.5", 18); // 0.5 tokens
  await tokenContract.transfer(recipient, transferAmount);
  
  // Burn tokens
  const burnAmount = ethers.utils.parseUnits("0.1", 18); // 0.1 tokens
  await tokenContract.burn(burnAmount);
}

interactWithToken()
  .then(() => console.log("Done!"))
  .catch(error => console.error(error));
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

## 🧩 Advanced Features

The QuickToken Kit can be easily enhanced with these premium features:

### Owner-Only Minting (For Controlled Supply)

Add this to your contract to restrict minting to the owner:

```solidity
// Add to QuickToken.sol
bool public ownerOnlyMinting = true;

function toggleOwnerOnlyMinting() external onlyOwner {
    ownerOnlyMinting = !ownerOnlyMinting;
}

// Modify the mint function
function mint(address to, uint256 amount) public payable nonReentrant {
    if (ownerOnlyMinting) {
        require(msg.sender == owner(), "QuickToken: Only owner can mint");
    }
    // Rest of the function stays the same
    // ...
}
```

### Minting Limits (For Controlled Growth)

```solidity
// Add to QuickToken.sol
uint256 public mintLimit = 1000 * 10**18; // Default: 1000 tokens
mapping(address => uint256) public mintedByAddress;

function setMintLimit(uint256 newLimit) external onlyOwner {
    mintLimit = newLimit;
}

// Modify the mint function
function mint(address to, uint256 amount) public payable nonReentrant {
    require(mintedByAddress[msg.sender] + amount <= mintLimit, "QuickToken: Exceeds mint limit");
    mintedByAddress[msg.sender] += amount;
    // Rest of the function stays the same
    // ...
}
```

### Upgradeable Contracts

For full upgradeability, transform the contract using OpenZeppelin's Upgradeable Contracts pattern:

```solidity
// Import upgradeable versions
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract QuickTokenUpgradeable is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    function initialize(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 mintFee_,
        uint256 lockDuration
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        // Rest of initialization
    }
    // Rest of contract functions
}
```

## 🧪 Example Use Cases

### Community Token

Create a token for your online community where members earn tokens for participation:

```javascript
// Deploy with these parameters
const tokenName = "Community Points";
const tokenSymbol = "CPTS";
const maxSupply = ethers.parseUnits("10000000", 18); // 10 Million tokens
const mintFee = ethers.parseEther("0.0001"); // Very small fee (accessible)
const lockDuration = 0; // No lock for immediate use
```

**Use Cases:**
- Reward active community members by airdropping tokens
- Create a community marketplace where goods/services are priced in your token
- Use token ownership to gate access to premium content

### Creator Economy Token

For content creators looking to monetize their audience:

```javascript
// Deploy with these parameters
const tokenName = "Creator Coin";
const tokenSymbol = "CRCN";
const maxSupply = ethers.parseUnits("1000000", 18); // 1 Million tokens (scarcity)
const mintFee = ethers.parseEther("0.005"); // Medium fee (revenue per supporter)
const lockDuration = 60 * 60 * 24 * 14; // 14-day lock (prevent initial dumping)
```

**Use Cases:**
- Sell tokens as "creator shares" where holders get exclusive benefits
- Allow fans to support you by minting tokens
- Create token-gated Discord channels or content

### Investment/DAO Token

For investment pools or DAOs:

```javascript
// Deploy with these parameters
const tokenName = "DAO Governance Token";
const tokenSymbol = "DAOG";
const maxSupply = ethers.parseUnits("100000", 18); // 100K tokens (high value per token)
const mintFee = ethers.parseEther("0.01"); // Higher fee (exclusive)
const lockDuration = 60 * 60 * 24 * 30; // 30-day lock (stability)
```

**Use Cases:**
- Use token ownership for DAO voting power
- Distribute funds in proportion to token ownership
- Create a treasury funded by mint fees

## 🧪 Testing Guide

Before deploying to mainnet, you should thoroughly test your token:

### 1. Local Testing

Run the built-in tests:
```bash
npx hardhat test
```

### 2. Testnet Deployment

Deploy to a testnet first:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Basic Verification Script

After deployment, run this script to verify basic functionality:

```javascript
// Save as scripts/verify-token.js
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Get contract address from command line or hardcode it
  const contractAddress = process.argv[2] || "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  console.log("Verifying token functionality at:", contractAddress);
  
  // Get signers
  const [owner, addr1] = await ethers.getSigners();
  
  // Connect to the deployed contract
  const QuickToken = await ethers.getContractFactory("QuickToken");
  const token = await QuickToken.attach(contractAddress);
  
  // Check basic information
  console.log("\n--- Basic Information ---");
  console.log("Name:", await token.name());
  console.log("Symbol:", await token.symbol());
  console.log("Max Supply:", ethers.formatUnits(await token.maxSupply(), 18));
  console.log("Mint Fee:", ethers.formatEther(await token.mintFee()), "ETH");
  
  const unlockTime = await token.unlockTime();
  const now = Math.floor(Date.now() / 1000);
  console.log("Time until unlock:", (unlockTime > now) ? 
    `${(unlockTime - now) / (60*60*24)} days` : "Already unlocked");
  
  // Test minting
  console.log("\n--- Testing Minting ---");
  const mintAmount = ethers.parseUnits("1", 18); // 1 token
  const mintFee = await token.calculateMintFee(mintAmount);
  console.log("Minting 1 token with fee:", ethers.formatEther(mintFee), "ETH");
  
  try {
    const tx = await token.mint(owner.address, mintAmount, { value: mintFee });
    await tx.wait();
    console.log("✅ Minting successful!");
  } catch (error) {
    console.error("❌ Minting failed:", error.message);
  }
  
  // Check balance
  console.log("\n--- Checking Balance ---");
  const balance = await token.balanceOf(owner.address);
  console.log("Owner balance:", ethers.formatUnits(balance, 18), "tokens");
  
  // Test transfer if not locked
  if (unlockTime <= now) {
    console.log("\n--- Testing Transfer ---");
    try {
      const tx = await token.transfer(addr1.address, ethers.parseUnits("0.1", 18));
      await tx.wait();
      console.log("✅ Transfer successful!");
      console.log("Recipient balance:", 
        ethers.formatUnits(await token.balanceOf(addr1.address), 18), "tokens");
    } catch (error) {
      console.error("❌ Transfer failed:", error.message);
    }
  } else {
    console.log("\n--- Skipping Transfer Test (tokens are locked) ---");
  }
  
  console.log("\n✅ Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run with:
```bash
npx hardhat run scripts/verify-token.js --network sepolia YOUR_CONTRACT_ADDRESS
```

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

This project is licensed under a proprietary license. Purchase of the QuickToken Kit grants you specific rights as outlined below:

### What You CAN Do:
- Use the software to create and deploy your own token smart contracts
- Modify the code for your own personal or commercial projects
- Deploy tokens created with this software on any compatible blockchain network

### What You CANNOT Do:
- Redistribute, resell, or sublicense the QuickToken Kit
- Remove proprietary notices or labels
- Create competing products for sale
- Claim that you created the original QuickToken Kit

For the complete license terms, please see the [LICENSE](./LICENSE) file included with this software.

### Commercial Options

We offer several licensing options to fit different needs:
- **Standard License**: For individual projects
- **Developer License**: For multiple projects (up to 5)
- **Enterprise License**: For unlimited projects and organizations

For pricing and detailed commercial terms, please see [COMMERCIAL_TERMS.md](./COMMERCIAL_TERMS.md).

---

Created with ❤️ by [GigaCode](https://github.com/Gcavazo1) | Gabriel Cavazos

For support, inquiries, or additional licensing options, contact: contact@gigacode.dev 