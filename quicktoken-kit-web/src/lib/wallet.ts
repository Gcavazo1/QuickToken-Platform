// Types
export type WalletProvider = 'metamask' | 'walletconnect';

export interface TokenConfig {
  name: string;
  symbol: string;
  maxSupply: string; // String to handle big numbers
  mintFee: string;   // String to handle ETH value (in wei)
  lockDuration: number; // Lock duration in seconds
}

// Contract deployment constants
export const CONTRACT_ABI = [
  // We'll add the actual ABI here in a future implementation
  // This will be pulled from the compiled contract's ABI
];

// Wallet connection
export async function connectWallet(provider: WalletProvider = 'metamask'): Promise<string> {
  try {
    // Basic implementation for now
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } else {
      throw new Error('No wallet detected');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Check if wallet is already connected
export async function checkWalletConnection(): Promise<string | null> {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0] || null;
    }
    return null;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return null;
  }
}

// Deploy token contract
export async function deployToken(config: TokenConfig): Promise<string> {
  try {
    // This is a placeholder for the actual implementation
    // We'll use ethers.js to deploy the contract
    console.log('Deploying token with config:', config);
    
    // Simulated contract deployment
    return `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  } catch (error) {
    console.error('Error deploying token:', error);
    throw error;
  }
}

// Add custom window typing for Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      request: (args: {method: string; params?: any[]}) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}
