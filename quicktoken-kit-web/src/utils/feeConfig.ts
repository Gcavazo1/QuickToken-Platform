/**
 * Centralized Fee Configuration
 * 
 * This file serves as the single source of truth for all fee-related settings
 * throughout the application. It ensures consistency between the frontend and
 * backend deployment processes.
 * 
 * Values are read from environment variables with well-defined fallbacks.
 * All values are validated to prevent invalid configurations.
 */

import { ethers } from 'ethers';

/**
 * Fee configuration interface
 */
export interface FeeConfig {
  // Platform wallet that receives fees
  platformWalletAddress: string;
  
  // Percentage of mint fees that go to the platform (0-100)
  platformFeePercentage: number;
  
  // Percentage of mint fees that go to the token creator (0-100)
  creatorFeePercentage: number;
  
  // Default mint fee in ETH for new tokens
  defaultMintFee: string;
  
  // Whether the platform address is properly configured
  isValidPlatformConfig: boolean;
  
  // Gas settings for deployment
  deployment: {
    gasLimit: number;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
  };
}

/**
 * Ethereum networks configuration
 */
export const NETWORKS = {
  1: {
    name: "Ethereum Mainnet",
    explorer: "https://etherscan.io"
  },
  5: {
    name: "Goerli Testnet",
    explorer: "https://goerli.etherscan.io"
  },
  11155111: {
    name: "Sepolia Testnet",
    explorer: "https://sepolia.etherscan.io"
  },
  137: {
    name: "Polygon Mainnet",
    explorer: "https://polygonscan.com"
  },
  80001: {
    name: "Polygon Mumbai Testnet",
    explorer: "https://mumbai.polygonscan.com"
  },
  // Add other networks as needed
};

/**
 * Default token settings
 */
export const DEFAULT_TOKEN_SETTINGS = {
  decimals: 18,
  initialSupply: "1000000",
  mintFee: "0.01",
  lockDuration: "30" // 30 days for lock duration
};

/**
 * Validate an Ethereum address
 * @param address The address to validate
 * @returns Whether the address is valid
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address) return false;
  
  try {
    // Using ethers v6 syntax
    const checksumAddress = ethers.getAddress(address);
    
    // Check if it's not the zero address - in v6 it's ethers.ZeroAddress
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    return checksumAddress !== zeroAddress && checksumAddress !== ethers.ZeroAddress;
  } catch (error) {
    console.error("Invalid Ethereum address:", address, error);
    return false;
  }
}

/**
 * Get the centralized fee configuration
 * @returns The complete fee configuration object
 */
export function getFeeConfig(): FeeConfig {
  // 1. Get platform wallet address from environment
  const platformWalletAddress = 
    process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS || 
    "";
  
  // 2. Get platform fee percentage from environment
  const rawPlatformFeePercentage = 
    process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE ? 
    parseInt(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE) : 
    20; // 20% default
  
  // 3. Validate and constrain platform fee percentage
  const platformFeePercentage = Math.max(0, Math.min(100, rawPlatformFeePercentage));
  
  // 4. Get default mint fee from environment
  const defaultMintFee = 
    process.env.NEXT_PUBLIC_DEFAULT_MINT_FEE || 
    "0.01"; // 0.01 ETH default
  
  // 5. Calculate creator fee percentage
  const creatorFeePercentage = 100 - platformFeePercentage;
  
  // 6. Validate platform address
  const isValidPlatformConfig = 
    platformFeePercentage === 0 || 
    isValidEthereumAddress(platformWalletAddress);
    
  // 7. Get deployment gas settings
  const gasLimit = process.env.NEXT_PUBLIC_DEPLOYMENT_GAS_LIMIT ? 
    parseInt(process.env.NEXT_PUBLIC_DEPLOYMENT_GAS_LIMIT) : 
    12000000; // 12 million gas default
  
  // 8. Assemble and return the config object
  return {
    platformWalletAddress,
    platformFeePercentage,
    creatorFeePercentage,
    defaultMintFee,
    isValidPlatformConfig,
    deployment: {
      gasLimit
    }
  };
}

// Create a singleton instance for easy import
const feeConfig = getFeeConfig();

// Log the fee configuration at initialization for debugging
if (typeof window !== 'undefined') {
  console.log('Fee Configuration Loaded:', {
    ...feeConfig,
    // Don't log the full address in production for security
    platformWalletAddress: feeConfig.platformWalletAddress ? 
      `${feeConfig.platformWalletAddress.substring(0, 6)}...${feeConfig.platformWalletAddress.substring(38)}` : 
      'Not set'
  });
}

export default feeConfig;

// Validate DEFAULT_TOKEN_SETTINGS values
(function validateTokenSettings() {
  try {
    // Check decimals
    if (DEFAULT_TOKEN_SETTINGS.decimals <= 0 || DEFAULT_TOKEN_SETTINGS.decimals > 18) {
      console.warn('WARNING: Default token decimals should be between 1 and 18');
    }

    // Check initial supply - attempt to parse as number
    const supplyNum = parseFloat(DEFAULT_TOKEN_SETTINGS.initialSupply);
    if (isNaN(supplyNum) || supplyNum <= 0) {
      console.warn('WARNING: Default token supply should be a positive number');
    }

    // Check mint fee - attempt to parse as ETH
    try {
      const mintFeeWei = ethers.parseEther(DEFAULT_TOKEN_SETTINGS.mintFee);
      // Use a comparison with 0 that works in both ES5 and ES2020 without BigInt literals
      const zero = BigInt(0);
      if (mintFeeWei <= zero) {
        console.warn('WARNING: Default mint fee should be greater than 0');
      }
    } catch (error) {
      console.warn('WARNING: Invalid mint fee format', error);
    }

    // Check lock duration is a reasonable number
    const lockDays = parseInt(DEFAULT_TOKEN_SETTINGS.lockDuration);
    if (isNaN(lockDays) || lockDays < 0 || lockDays > 3650) {
      console.warn('WARNING: Lock duration should be between 0 and 3650 days (10 years)');
    }
  } catch (error) {
    console.error('Error validating DEFAULT_TOKEN_SETTINGS:', error);
  }
})(); 