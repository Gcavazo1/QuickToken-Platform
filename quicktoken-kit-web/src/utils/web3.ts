import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';

// Supported chain IDs for the application
export const SUPPORTED_CHAIN_IDS = [1, 3, 4, 5, 42, 56, 137, 80001, 11155111, 10, 42161, 8453];

// Common network names for reference
export const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  80001: 'Polygon Mumbai',
  10: 'Optimism',
  42161: 'Arbitrum One',
  8453: 'Base'
};

// MetaMask connector (single instance to be reused)
export const injectedConnector = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});

/**
 * Compatibility layer for web3-react v6 with ethers v6
 * This creates a wrapper that presents a Web3Provider-like interface that web3-react expects,
 * while using ethers v6's BrowserProvider under the hood
 */
export class Web3ProviderCompatibility {
  private _provider: ethers.BrowserProvider;
  
  // Properties that web3-react expects from an ethers v5 provider
  public getSigner: () => Promise<ethers.JsonRpcSigner>;
  public provider: any;
  public _networkPromise: Promise<any>;
  
  constructor(externalProvider: any) {
    // Initialize the ethers v6 provider
    this._provider = new ethers.BrowserProvider(externalProvider);
    this.provider = externalProvider;
    
    // Create a compatible getSigner method
    this.getSigner = async () => {
      return this._provider.getSigner();
    };
    
    // Create a network promise that web3-react might use
    this._networkPromise = this._provider.getNetwork();
  }
  
  // Add any v5 provider methods that web3-react might call
  async getNetwork() {
    return this._provider.getNetwork();
  }
  
  // Allow direct access to the underlying v6 provider
  getBrowserProvider() {
    return this._provider;
  }
}

/**
 * Creates a compatible provider for web3-react that uses ethers v6 under the hood
 * @param provider The provider from MetaMask or other wallet
 * @returns Compatible provider instance
 */
export function getLibrary(provider: any): Web3ProviderCompatibility {
  try {
    return new Web3ProviderCompatibility(provider);
  } catch (error) {
    console.error('Error creating compatibility provider:', error);
    throw new Error('Failed to initialize Ethereum provider');
  }
}

/**
 * Gets a signer from the provider - works with both the compatibility layer and direct BrowserProvider
 * @param provider Either a compatibility provider or a BrowserProvider
 * @returns Promise resolving to a JsonRpcSigner
 */
export async function getSigner(provider: any): Promise<ethers.JsonRpcSigner> {
  try {
    // Check if this is our compatibility wrapper or a direct BrowserProvider
    if (provider instanceof Web3ProviderCompatibility) {
      return provider.getSigner();
    } 
    
    // Assume it's a BrowserProvider
    if (provider.getSigner) {
      return provider.getSigner();
    }
    
    throw new Error("Unsupported provider type");
  } catch (error) {
    console.error('Error getting signer:', error);
    throw new Error('Failed to get signer. Please check your wallet connection.');
  }
}

/**
 * Shortens an Ethereum address to the format: 0x1234...5678
 * @param address - The full Ethereum address to shorten
 * @param chars - Number of characters to show at the beginning and end (default: 4)
 * @returns Shortened address string
 */
export function shortenAddress(address: string | null | undefined, chars = 4): string {
  if (!address) return '';
  if (address.length < chars * 2) return address;
  
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Formats an amount in wei to a readable ETH value
 * @param weiAmount Amount in wei as string or bigint
 * @returns Formatted ETH amount as a string
 */
export function formatWeiToEth(weiAmount: string | bigint): string {
  if (!weiAmount) return '0';
  try {
    return ethers.formatEther(weiAmount);
  } catch (err) {
    console.error('Error formatting wei amount:', err);
    return '0';
  }
}

/**
 * Validates an Ethereum address
 * @param address Address to validate
 * @returns True if the address is valid
 */
export function isValidAddress(address: string): boolean {
  if (!address) return false;
  
  try {
    // This will validate and checksum the address
    ethers.getAddress(address);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Gets the current gas price from the provider
 * @param provider Any provider (compatibility wrapper or direct BrowserProvider)
 * @returns Promise resolving to the current gas price as a string in gwei
 */
export async function getCurrentGasPrice(provider: any): Promise<string> {
  try {
    // Handle our compatibility wrapper
    if (provider instanceof Web3ProviderCompatibility) {
      provider = provider.getBrowserProvider();
    }
    
    // Assume it's a BrowserProvider
    const feeData = await provider.getFeeData();
    if (!feeData.gasPrice) return '0';
    
    // Convert to gwei for better readability
    return ethers.formatUnits(feeData.gasPrice, 'gwei');
  } catch (err) {
    console.error('Error getting gas price:', err);
    return '0';
  }
} 