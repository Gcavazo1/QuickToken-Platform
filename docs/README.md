# QuickToken Kit

A complete ERC-20 token creation toolkit with advanced features for launching custom tokens on Ethereum and compatible networks.

## ⭐ Features

- **ERC-20 Compliant**: Built on OpenZeppelin's battle-tested contract library
- **Advanced Token Economics**:
  - Configurable mint fee to create revenue from token creation
  - Maximum supply cap to control token inflation
  - Time-locked transfers for launch stability
  - Built-in burn functionality to reduce supply over time
- **Multi-Network Support**: Deploy to Ethereum, Optimism, Polygon, Arbitrum, and Base
- **Owner Controls**: Owner-only functions for administrative control
- **Comprehensive Testing**: Full test suite with Mocha and Chai
- **Detailed Verification**: Scripts to validate functionality post-deployment

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) (v8+)
- [Metamask](https://metamask.io/) wallet with testnet/mainnet funds
- [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/) API key

## 🔧 Setup

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd quickstart-token-kit
npm install
```

2. Create a `.env` file in the root directory with your configuration:

```
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

⚠️ **SECURITY WARNING**: Never commit your `.env` file to version control!

## 📝 Token Configuration

Before deployment, customize your token parameters in the `scripts/deploy.js` file:

```javascript
// Token parameters
const NAME = "QuickToken";          // Your token name
const SYMBOL = "QTK";               // Your token symbol (3-4 characters recommended)
const MAX_SUPPLY = "1000000";       // Maximum token supply (in whole tokens)
const MINT_FEE = "0.01";            // Fee per token (in ETH)
const LOCK_DURATION = 86400 * 7;    // Time lock in seconds (7 days)
```

## 🚀 Deployment

### Deploy to a Test Network (Recommended First Steps)

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### Deploy to Mainnet Networks

```bash
# Ethereum Mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Polygon
npx hardhat run scripts/deploy.js --network polygon

# Optimism
npx hardhat run scripts/deploy.js --network optimism

# Arbitrum
npx hardhat run scripts/deploy.js --network arbitrum

# Base
npx hardhat run scripts/deploy.js --network base
```

After deployment, the script will output your contract address. **Save this address for verification and interaction!**

## ✅ Verify Deployment

1. Verify your contract on the blockchain explorer:

```bash
# Replace with your contract address and constructor arguments
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS "QuickToken" "QTK" "1000000000000000000000000" "10000000000000000" "604800"
```

2. Run the verification script to check token functionality:

```bash
# Replace with your contract address
npx hardhat run scripts/verify-token.js --network sepolia YOUR_CONTRACT_ADDRESS
```

## 🧪 Testing

Run the test suite to verify contract functionality:

```bash
npx hardhat test
```

The test suite validates:
- Basic token properties
- Minting functionality and fee collection
- Time-lock transfer restrictions
- Burn functionality
- Owner permissions

## 💼 Commercial Use

For commercial applications, consider these customizations:

1. **Token Distribution**: Create additional scripts for token airdrops or sales events
2. **Admin Controls**: Add more admin functions like pausing or upgradeability
3. **Revenue Strategy**: Adjust mint fees based on market research and tokenomics
4. **Lock Tiers**: Implement tiered time-lock system for different user categories

## 📱 Frontend Integration

For wallet integration in web applications:

1. Use [ethers.js](https://docs.ethers.io/) to connect to user wallets
2. Follow this pattern for interacting with your token:

```javascript
// Example frontend code for connecting to the token contract
const { ethers } = require("ethers");
const tokenABI = require("../artifacts/contracts/QuickToken.sol/QuickToken.json").abi;

async function connectToToken(contractAddress) {
  // Connect to the user's wallet
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  
  // Connect to the contract
  const tokenContract = new ethers.Contract(contractAddress, tokenABI, signer);
  
  // Now you can call functions like:
  const tokenName = await tokenContract.name();
  const userBalance = await tokenContract.balanceOf(await signer.getAddress());
  
  return tokenContract;
}
```

## 🔄 Advanced Interaction

The QuickToken contract exposes these primary functions:

### For Users
- `balanceOf(address)`: Check token balance
- `transfer(address, amount)`: Transfer tokens (subject to time-lock)
- `burn(amount)`: Burn tokens to reduce supply

### For Owners
- `mint(address, amount)`: Create new tokens up to max supply (requires fee)
- `withdrawFees()`: Withdraw collected mint fees to owner address

## 🛠️ Troubleshooting

Common issues and solutions:

- **Transaction Reverted**: Check time-lock status, balance, or gas fees
- **Verification Failed**: Ensure constructor arguments match exactly what was deployed
- **Contract Not Found**: Confirm you're connected to the right network
- **Insufficient Funds Error**: Check wallet balance for ETH to cover gas + mint fees

## 📞 Support

For questions or customization requests:

- Open an issue on GitHub: [https://github.com/Gcavazo1/QuickToken-Kit/issues](https://github.com/Gcavazo1/QuickToken-Kit/issues)
- Contact the development team at [contact@gigacode.dev](mailto:contact@gigacode.dev)

## 📜 License

This project is licensed under a proprietary license. Purchase of the QuickToken Kit grants you specific usage rights while restricting redistribution and resale.

For full license terms, please see the LICENSE file included with this software.

---

Happy token launching! 🚀
