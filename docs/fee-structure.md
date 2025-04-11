# QuickToken Platform Fee Structure

This document outlines the fee structure for QuickToken Platform, explaining how fees are handled both for platform users and for buyers of the commercial package.

## Platform Usage Fees

When users deploy tokens through the QuickToken Platform web interface, the following fee structure applies:

### Beta Period (Current)

During our beta period (ending May 25, 2025), we offer free token deployment with a standard revenue-sharing model:

| Fee Type | Amount | Description |
|----------|--------|-------------|
| Deployment Fee | Free | No upfront cost to deploy a new token contract |
| Platform Revenue Share | 20% | Percentage of mint fees allocated to the platform |
| Token Creator Share | 80% | Percentage of mint fees allocated to the token creator |
| Gas Fees | Network-dependent | Transaction fees paid to the blockchain network |

### Post-Beta Pricing Plans

After our beta period concludes, users will have two pricing options:

#### Standard Plan
| Fee Type | Amount | Description |
|----------|--------|-------------|
| Deployment Fee | $40-80 ETH | One-time fee to deploy a new token contract |
| Platform Revenue Share | 18% | Percentage of mint fees allocated to the platform |
| Token Creator Share | 82% | Percentage of mint fees allocated to the token creator |

**Benefits:**
- Lower percentage on ongoing mint fees
- Better for high-volume tokens
- Higher share of revenue for creator

#### Zero Upfront Plan
| Fee Type | Amount | Description |
|----------|--------|-------------|
| Deployment Fee | $0 ETH | No upfront cost to deploy a new token contract |
| Platform Revenue Share | 25-30% | Percentage of mint fees allocated to the platform |
| Token Creator Share | 70-75% | Percentage of mint fees allocated to the token creator |

**Benefits:**
- No upfront deployment fee
- Ideal for uncertain token adoption
- Risk-free deployment

**Note:** Final pricing will be determined at beta conclusion based on market conditions.

### How Mint Fees Work

1. When a token is deployed, the creator sets a mint fee (e.g., 0.01 ETH per token)
2. When users mint tokens, they pay this fee multiplied by the number of tokens minted
3. The mint fee is automatically split between:
   - The platform (percentage varies by plan)
   - The token creator/owner (remaining percentage)
4. These funds are distributed in real-time during the mint transaction

### Example Fee Calculation (Beta Period)

For a token with a 0.01 ETH mint fee:

| Action | Total Fee | Platform (20%) | Creator (80%) |
|--------|-----------|----------------|---------------|
| Mint 1 token | 0.01 ETH | 0.002 ETH | 0.008 ETH |
| Mint 10 tokens | 0.1 ETH | 0.02 ETH | 0.08 ETH |
| Mint 100 tokens | 1 ETH | 0.2 ETH | 0.8 ETH |

## Commercial Package Purchase & Custom Services

For customers who purchase the QuickToken Commercial Package (source code) or request custom deployment services:

### License Fees

| Package | Price | Description |
|---------|-------|-------------|
| Standard License | $X | One-time fee to deploy for a single client/project |
| Extended License | $Y | One-time fee to create a commercial platform |
| Custom Deployment | Contact Us | Custom token deployment and management services |

### Ongoing Fees

| Fee Type | Amount | Description |
|----------|--------|-------------|
| Platform Revenue Share | None | Buyers keep 100% of fees from their deployments |
| Support/Updates | Optional | Additional fees may apply for ongoing support |
| Custom Management | Contact Us | Fees for ongoing token management services |

## Technical Implementation

The platform fee mechanism is implemented directly in the smart contract:

```solidity
// Platform fee configuration in the QuickToken contract
address public platformFeeAddress;
uint256 public platformFeePercentage; // out of 100 (e.g., 20 for 20%)

// Fee distribution logic in the mint function
function mint(address to, uint256 amount) public payable {
    // ...
    uint256 requiredFee = (mintFee * amount) / 1e18;
    
    // Calculate fee split
    uint256 platformAmount = (requiredFee * platformFeePercentage) / 100;
    uint256 ownerAmount = requiredFee - platformAmount;
    
    // Transfer fees to platform and owner
    // ...
}
```

## Fee Transparency

All fees are explicitly disclosed:
1. On the token deployment page
2. In the platform documentation
3. In the smart contract code

## Fee Changes

QuickToken Platform reserves the right to adjust fee percentages:
1. For new token deployments (will not affect existing tokens)
2. With reasonable notice to users
3. Never exceeding 30% platform share for existing deployments 