# QuickToken Contract Deployment Guide

This guide explains how to deploy the QuickToken smart contract to Ethereum and compatible networks.

## Prerequisites

- Node.js v16+ and npm/yarn installed
- Ethereum wallet with private key access
- Network tokens for gas fees (ETH, MATIC, etc.)
- Infura API key (free tier is sufficient)
- Basic understanding of blockchain interactions

## Environment Setup

1. Configure your environment variables by creating/editing the `config/.env` file:

```
# Network API Keys
INFURA_API_KEY=your_infura_api_key

# Wallet Private Key (without 0x prefix)
PRIVATE_KEY=your_wallet_private_key_here_without_0x_prefix

# Explorer API Keys (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Platform Fee Configuration
PLATFORM_WALLET_ADDRESS=your_platform_wallet_address
PLATFORM_FEE_PERCENTAGE=20
```

2. Install dependencies:

```bash
npm install
# or 
yarn install
```

3. Compile the contracts:

```bash
npx hardhat compile
```

## Token Configuration

Customize your token by modifying the parameters in `scripts/deploy.js`:

```javascript
// Basic token configuration
const tokenName = "My Token";         // Your token's name
const tokenSymbol = "MTK";            // Your token's symbol (2-6 characters recommended)
const maxSupply = ethers.parseUnits("1000000", 18); // Maximum total supply (with 18 decimals)
const mintFee = ethers.parseEther("0.001"); // Fee to mint each token
const lockDuration = 60 * 60 * 24 * 30; // Time lock in seconds (30 days in this example)
const platformAddress = process.env.PLATFORM_WALLET_ADDRESS || "0x..."; // Platform wallet address
const platformFeePercentage = parseInt(process.env.PLATFORM_FEE_PERCENTAGE || "20"); // Platform fee percentage
```

### Parameter Explanation

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| `tokenName` | The full name of your token | "My Awesome Token" |
| `tokenSymbol` | Trading symbol (2-6 characters) | "MAT" |
| `maxSupply` | Maximum tokens that can exist | "1000000" (1 million tokens) |
| `mintFee` | Fee to mint 1 token | "0.001" (in ETH/MATIC) |
| `lockDuration` | Period tokens are time-locked | 2592000 (30 days in seconds) |
| `platformAddress` | Address receiving platform fees | Your platform wallet address |
| `platformFeePercentage` | % of mint fees for platform | 20 (for 20%) |

## Fee Structure

The QuickToken contract includes a revenue-sharing model for mint fees:

- **Token Creator Share**: By default, 80% of all mint fees go to the token creator/owner
- **Platform Share**: By default, 20% of all mint fees go to the platform address

These percentages can be adjusted during the deployment process as needed, but typically follow our standard fee model. For more information, see our [Fee Structure Documentation](./fee-structure.md).

## Deployment Options

### Option 1: Standard Script Deployment

Deploy to a network specified in hardhat.config.js:

```bash
# For Ethereum Mainnet
npx hardhat run scripts/deploy.js --network mainnet

# For Polygon (Recommended for lower fees)
npx hardhat run scripts/deploy.js --network polygon

# For Optimism
npx hardhat run scripts/deploy.js --network optimism

# For Base
npx hardhat run scripts/deploy.js --network base

# For testnets (Use these first to test)
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/deploy.js --network mumbai
```

### Option 2: Deployment with Database Tracking

The deployment script automatically tracks deployments in your Supabase database when environment variables are properly configured:

```bash
# For Ethereum Mainnet with tracking
npx hardhat run scripts/deploy.js --network mainnet

# For Polygon
npx hardhat run scripts/deploy.js --network polygon
```

This will store deployment information in your Supabase database for easy management.

## Verification

After deployment, verify your contract on the blockchain explorer:

```bash
# Replace with your actual parameters
npx hardhat verify --network polygon 0xYOUR_CONTRACT_ADDRESS "TokenName" "SYMBOL" "TOTAL_SUPPLY" "MINT_FEE" "LOCK_DURATION" "PLATFORM_ADDRESS" "PLATFORM_FEE_PERCENTAGE"
```

For example:

```bash
npx hardhat verify --network polygon 0x1234567890AbCdEf1234567890AbCdEf12345678 "MyToken" "MTK" "1000000000000000000000000" "1000000000000000" "2592000" "0xYourPlatformAddress" "20"
```

## Network Selection Guide

QuickToken contracts can be deployed on multiple EVM-compatible networks. Each network offers different benefits in terms of cost, speed, and ecosystem. Choose the best network for your specific needs:

### Production Networks

<table>
  <thead>
    <tr>
      <th>Network</th>
      <th>Gas Costs</th>
      <th>Tx Time</th>
      <th>Ecosystem Size</th>
      <th>Key Benefits</th>
      <th>Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>Ethereum Mainnet</strong><br/>
        <small><a href="https://etherscan.io">Explorer</a> | <a href="https://ethereum.org">Website</a></small>
      </td>
      <td>Very High<br/><small>$10-100+ per deployment</small></td>
      <td>3-5 min<br/><small>~12 sec block time</small></td>
      <td>Largest<br/><small>Most established</small></td>
      <td>
        • Highest security<br/>
        • Most liquidity<br/>
        • Widest adoption
      </td>
      <td>
        • High-value tokens<br/>
        • Blue-chip projects<br/>
        • Strong security needs
      </td>
    </tr>
    <tr>
      <td>
        <strong>Polygon</strong><br/>
        <small><a href="https://polygonscan.com">Explorer</a> | <a href="https://polygon.technology">Website</a></small>
      </td>
      <td>Very Low<br/><small>$0.01-0.10 per deployment</small></td>
      <td>~2 sec<br/><small>Fast finality</small></td>
      <td>Large<br/><small>Growing rapidly</small></td>
      <td>
        • Extremely low fees<br/>
        • Fast transactions<br/>
        • Strong ecosystem
      </td>
      <td>
        • High transaction volume<br/>
        • Cost-sensitive applications<br/>
        • Gaming & NFT projects
      </td>
    </tr>
    <tr>
      <td>
        <strong>Optimism</strong><br/>
        <small><a href="https://optimistic.etherscan.io">Explorer</a> | <a href="https://optimism.io">Website</a></small>
      </td>
      <td>Low<br/><small>$0.25-1.00 per deployment</small></td>
      <td>~2 sec<br/><small>Fast finality</small></td>
      <td>Medium<br/><small>Growing ecosystem</small></td>
      <td>
        • Low fees<br/>
        • Ethereum security<br/>
        • OP token incentives
      </td>
      <td>
        • DeFi applications<br/>
        • Ethereum-compatible apps<br/>
        • DAO governance tokens
      </td>
    </tr>
    <tr>
      <td>
        <strong>Base</strong><br/>
        <small><a href="https://basescan.org">Explorer</a> | <a href="https://base.org">Website</a></small>
      </td>
      <td>Low<br/><small>$0.10-0.50 per deployment</small></td>
      <td>~2 sec<br/><small>Fast finality</small></td>
      <td>Growing<br/><small>Coinbase backed</small></td>
      <td>
        • Coinbase integration<br/>
        • Low fees<br/>
        • Growing user base
      </td>
      <td>
        • Consumer applications<br/>
        • Coinbase-focused users<br/>
        • Social tokens
      </td>
    </tr>
    <tr>
      <td>
        <strong>Arbitrum</strong><br/>
        <small><a href="https://arbiscan.io">Explorer</a> | <a href="https://arbitrum.io">Website</a></small>
      </td>
      <td>Low<br/><small>$0.25-1.00 per deployment</small></td>
      <td>~0.5-2 sec<br/><small>Very fast</small></td>
      <td>Large<br/><small>Strong DeFi presence</small></td>
      <td>
        • Fast confirmations<br/>
        • Low gas fees<br/>
        • EVM compatibility
      </td>
      <td>
        • Complex applications<br/>
        • DeFi protocols<br/>
        • High-throughput dApps
      </td>
    </tr>
  </tbody>
</table>

### Test Networks

<table>
  <thead>
    <tr>
      <th>Network</th>
      <th>Currency</th>
      <th>Faucet</th>
      <th>Production Equivalent</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>Sepolia</strong><br/>
        <small><a href="https://sepolia.etherscan.io">Explorer</a></small>
      </td>
      <td>SepoliaETH</td>
      <td><a href="https://sepoliafaucet.com/">Sepolia Faucet</a></td>
      <td>Ethereum Mainnet</td>
      <td>Recommended Ethereum testnet (Goerli deprecated)</td>
    </tr>
    <tr>
      <td>
        <strong>Mumbai</strong><br/>
        <small><a href="https://mumbai.polygonscan.com">Explorer</a></small>
      </td>
      <td>MATIC</td>
      <td><a href="https://faucet.polygon.technology/">Polygon Faucet</a></td>
      <td>Polygon</td>
      <td>Polygon's primary testnet</td>
    </tr>
    <tr>
      <td>
        <strong>Optimism Goerli</strong><br/>
        <small><a href="https://goerli-optimism.etherscan.io/">Explorer</a></small>
      </td>
      <td>OptimismETH</td>
      <td><a href="https://optimismfaucet.xyz/">Optimism Faucet</a></td>
      <td>Optimism</td>
      <td>Optimism's primary testnet</td>
    </tr>
    <tr>
      <td>
        <strong>Base Goerli</strong><br/>
        <small><a href="https://goerli.basescan.org/">Explorer</a></small>
      </td>
      <td>BaseETH</td>
      <td><a href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet">Base Faucet</a></td>
      <td>Base</td>
      <td>Base's primary testnet</td>
    </tr>
  </tbody>
</table>

### Network Selection Tips

1. **Always test on testnets first:** Deploy to testnets before mainnet to verify functionality and identify issues.

2. **Consider your audience:** Where are your target users? Choose networks they already use.

3. **Gas price considerations:** For high-volume tokens with many expected mints, lower gas networks like Polygon or Base offer significant cost advantages.

4. **Deploy to multiple networks:** Your contract can exist on multiple networks - consider a primary network and secondary ones.

5. **MetaMask Connection:** When using our DApp, simply connect your MetaMask wallet and switch to your desired network to deploy.

## After Deployment

1. Save your contract address shown in the console after deployment
2. Add the token to your web interface (update `.env.local` in the web app)
3. Test basic functionality (transfers, minting, etc.)
4. Set up token tracking in the admin dashboard

## Troubleshooting

### Common Issues

1. **Insufficient Funds**: Ensure your wallet has enough tokens for gas
   ```
   Error: insufficient funds for gas * price + value
   ```
   Solution: Add more ETH/MATIC to your deployment wallet

2. **Nonce too low**: Transaction ordering issue
   ```
   Error: nonce too low
   ```
   Solution: Reset your account in MetaMask or increment nonce manually

3. **Gas Limit Exceeded**: Contract deployment too expensive
   ```
   Error: transaction underpriced
   ```
   Solution: Increase gas limit in hardhat.config.js

### Getting Help

If you encounter any issues, please:
1. Check the Hardhat documentation: https://hardhat.org/hardhat-runner/docs/
2. Review the OpenZeppelin forums: https://forum.openzeppelin.com/
3. Contact support at contact@gigacode.dev 