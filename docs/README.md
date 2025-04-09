# QuickStart Token Kit

A production-ready, customizable ERC-20 token contract for creators, small DAOs, and developers who want to deploy a custom token with optional passive-income features.

## Features

- **Customizable Parameters**: Set your token's name, symbol, max supply, and more
- **Optional Mint Fee**: Generate passive income by setting a fee for minting tokens
- **Time Lock**: Prevent token transfers until a specified time after deployment
- **Burn Support**: Allow reducing token supply through burning
- **Gas Efficient**: Built on top of OpenZeppelin's battle-tested contracts
- **Fully Tested**: Comprehensive test suite with 100% coverage

## Getting Started

### Prerequisites

- Node.js v16 or later
- NPM or Yarn
- Git

### Installation

1. Clone this repository
```
git clone https://github.com/yourusername/quickstart-token-kit.git
cd quickstart-token-kit
```

2. Install dependencies
```
npm install
```

3. Compile the contracts
```
npx hardhat compile
```

4. Run tests
```
npx hardhat test
```

## Deployment

### Local Testing Network

To deploy the contract on a local Hardhat network:

1. Start a local Hardhat node
```
npx hardhat node
```

2. Deploy the contract to the local network in a separate terminal
```
npx hardhat run scripts/deploy.js --network localhost
```

### Public Testnet or Mainnet

1. Create a `.env` file in the project root with your configuration:
```
PRIVATE_KEY=your_private_key_here
GOERLI_RPC_URL=your_goerli_rpc_url
MAINNET_RPC_URL=your_mainnet_rpc_url
```

2. Deploy to a public network (Goerli testnet example):
```
npx hardhat run scripts/deploy.js --network goerli
```

## Token Configuration

When deploying, you can customize your token by modifying the parameters in `scripts/deploy.js`:

- `tokenName`: The name of your token (e.g., "MyAwesomeToken")
- `tokenSymbol`: The symbol for your token (e.g., "MAT")
- `maxSupply`: Maximum total supply of tokens (in ether units, default 1,000,000)
- `mintFee`: Fee charged per token when minted (in ether, default 0.01 ETH)
- `lockDuration`: Duration in seconds during which tokens cannot be transferred after deployment (default 7 days)

## Contract Functions

### For Token Holders

- `mint(address to, uint256 amount)`: Mint new tokens by paying the required fee
- `burn(uint256 amount)`: Burn your own tokens
- `burnFrom(address account, uint256 amount)`: Burn tokens from an account that has approved you
- `transfer(address to, uint256 amount)`: Transfer tokens to another address (if not time-locked)
- `approve(address spender, uint256 amount)`: Approve another address to spend your tokens

### For Token Owners

- `owner()`: View the contract owner address
- `transferOwnership(address newOwner)`: Transfer ownership to a new address

### View Functions

- `getTimeUntilUnlock()`: Get the remaining time until transfers are unlocked
- `maxSupply()`: Get the maximum possible supply
- `mintFee()`: Get the fee required to mint one token
- `unlockTime()`: Get the timestamp when transfers will be unlocked

## Monetization Ideas

The QuickToken contract includes a built-in mint fee that allows you to generate passive income:

1. **Community Token**: Deploy the token for your community and set a reasonable mint fee
2. **Creator Economy**: Use the token for your content ecosystem and earn on every mint
3. **DAO Funding**: Fund your DAO treasury through initial token minting fees
4. **Membership Tokens**: Deploy tokens that represent membership in your organization

## Future Extensions

Potential future extensions to consider:

- Airdrop feature for the owner
- Loyalty bonus for large token purchases
- CLI minting tool
- Web dashboard for token management

## License

This project is licensed under the MIT License - see the LICENSE file for details.
