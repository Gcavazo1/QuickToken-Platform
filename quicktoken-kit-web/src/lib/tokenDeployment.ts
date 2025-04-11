import { ethers } from 'ethers';
import QuickTokenABI from '../contracts/QuickToken.json';
import feeConfig from '../utils/feeConfig';

// Token deployment parameters interface
export interface TokenDeploymentParams {
  name: string;
  symbol: string;
  maxSupply: string;
  mintFee: string;
  lockDuration: number; // in days
  owner?: string; // Optional, defaults to the connected wallet
}

// Token deployment result interface
export interface TokenDeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
  errorDetails?: unknown;
}

// Define ethers v6 error interface for better typing
interface EthersError extends Error {
  code?: string;
  action?: string;
  reason?: string;
  data?: string;
  transaction?: {
    hash: string;
    from: string;
    to?: string;
    data?: string;
    [key: string]: any;
  };
  receipt?: {
    status: number;
    gasUsed?: bigint;
    contractAddress?: string;
    [key: string]: any;
  };
}

// Define the deployment data structure
export interface DeploymentData {
  contractAddress: string;
  transactionHash: string;
  name: string;
  symbol: string;
  maxSupply: string;
  mintFee: string;
  lockDuration: number;
  network: string;
  timestamp?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Modern function-based approach for token deployment
 * Recommended for new integrations
 */
export async function deployToken(
  provider: ethers.BrowserProvider,
  params: TokenDeploymentParams
): Promise<TokenDeploymentResult> {
  try {
    const signer = await provider.getSigner();
    
    // Create contract factory
    const factory = new ethers.ContractFactory(
      QuickTokenABI.abi,
      QuickTokenABI.bytecode,
      signer
    );
    
    // Convert parameters to the right format
    const maxSupply = ethers.parseUnits(params.maxSupply, 18); // 18 decimals
    const mintFee = ethers.parseEther(params.mintFee); // ETH has 18 decimals
    const lockDuration = params.lockDuration * 24 * 60 * 60; // Convert days to seconds
    
    console.log('Deploying contract with parameters:');
    console.log('Name:', params.name);
    console.log('Symbol:', params.symbol);
    console.log('Max Supply:', maxSupply.toString());
    console.log('Mint Fee:', mintFee.toString());
    console.log('Lock Duration:', lockDuration, 'seconds (', params.lockDuration, 'days)');
    console.log('Platform Address:', feeConfig.platformWalletAddress);
    console.log('Platform Fee %:', feeConfig.platformFeePercentage);
    
    // Use gasLimit from centralized fee configuration
    const deployOptions = {
      gasLimit: BigInt(feeConfig.deployment.gasLimit)
    };
    
    console.log(`Using gas limit: ${feeConfig.deployment.gasLimit}`);
    
    // Deploy the contract with v6 syntax
    const contract = await factory.deploy(
      params.name,
      params.symbol,
      maxSupply,
      mintFee,
      lockDuration,
      feeConfig.platformWalletAddress,
      feeConfig.platformFeePercentage,
      deployOptions
    );
    
    console.log('Sending deployment transaction...');
    const deployTx = contract.deploymentTransaction();
    if (!deployTx) {
      throw new Error("Failed to get deployment transaction");
    }
    
    console.log('Transaction hash:', deployTx.hash);
    
    // Wait for confirmation
    console.log('Waiting for confirmation...');
    const receipt = await deployTx.wait();
    if (!receipt) {
      throw new Error("Failed to get transaction receipt");
    }
    
    // Get contract address
    const contractAddress = await contract.getAddress();
    console.log('Contract deployed at:', contractAddress);
    
    return {
      success: true,
      contractAddress,
      transactionHash: deployTx.hash
    };
  } catch (error: any) {
    console.error('Deployment error:', error);
    
    // Create a more detailed error message for better debugging
    let errorMessage = 'Unknown error during deployment';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.reason) {
      errorMessage = `Deployment failed: ${error.reason}`;
    } else if (error.code) {
      switch(error.code) {
        case 'ACTION_REJECTED':
          errorMessage = 'User rejected the transaction';
          break;
        case 'INSUFFICIENT_FUNDS':
          errorMessage = 'Insufficient funds for deployment';
          break;
        case 'UNPREDICTABLE_GAS_LIMIT':
          errorMessage = 'Could not estimate gas limit for deployment';
          break;
        default:
          errorMessage = `Error code: ${error.code}`;
      }
    }
    
    return {
      success: false,
      error: errorMessage,
      errorDetails: error
    };
  }
}

/**
 * Legacy class-based token deployer
 * Maintained for backward compatibility
 */
export class TokenDeployer {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  
  constructor(provider?: ethers.BrowserProvider) {
    if (provider) {
      this.initialize(provider);
    }
  }
  
  async initialize(provider: ethers.BrowserProvider) {
    this.provider = provider;
    this.signer = await provider.getSigner();
  }
  
  async estimateGas(params: TokenDeploymentParams): Promise<string> {
    if (!this.provider || !this.signer) {
      throw new Error("Provider not initialized");
    }
    
    try {
      // Create contract factory
      const factory = new ethers.ContractFactory(
        QuickTokenABI.abi,
        QuickTokenABI.bytecode,
        this.signer
      );
      
      // Convert parameters to the right format - using the same conversion as deployToken
      const maxSupply = ethers.parseUnits(params.maxSupply, 18); // 18 decimals
      const mintFee = ethers.parseEther(params.mintFee); // ETH has 18 decimals
      const lockDuration = params.lockDuration * 24 * 60 * 60; // Convert days to seconds
      
      // Create the deployment transaction
      const deployTx = await factory.getDeployTransaction(
        params.name,
        params.symbol,
        maxSupply,
        mintFee,
        lockDuration,
        feeConfig.platformWalletAddress,
        feeConfig.platformFeePercentage
      );
      
      // Set gas limit
      deployTx.gasLimit = BigInt(feeConfig.deployment.gasLimit);
      
      // Estimate gas for deployment
      const estimate = await this.provider.estimateGas(deployTx);
      
      // Get current gas price using getFeeData method
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      
      // Calculate total gas cost
      const gasCost = gasPrice * estimate;
      
      // Convert to ETH
      const ethCost = ethers.formatEther(gasCost);
      
      console.log(`Estimated deployment cost: ${ethCost} ETH`);
      console.log(`Gas limit: ${feeConfig.deployment.gasLimit}`);
      console.log(`Estimated gas needed: ${estimate.toString()}`);
      
      return ethCost;
    } catch (error: any) {
      console.error("Gas estimation error:", error);
      let errorMessage = "Error estimating gas";
      
      if (error.message) {
        errorMessage += `: ${error.message}`;
      } else if (error.reason) {
        errorMessage += `: ${error.reason}`;
      } else if (error.code) {
        errorMessage += `: ${error.code}`;
      }
      
      return errorMessage;
    }
  }
  
  async deploy(params: TokenDeploymentParams): Promise<TokenDeploymentResult> {
    if (!this.provider || !this.signer) {
      return {
        success: false,
        error: "Provider not initialized"
      };
    }
    
    // Use the function-based implementation for deployment
    return deployToken(this.provider, params);
  }
}

// Helper function to create a deployer instance (legacy support)
export const createTokenDeployer = (provider: ethers.BrowserProvider): TokenDeployer => {
  return new TokenDeployer(provider);
};

// Utility function to track deployments in database or local storage
export async function trackDeployment(data: DeploymentData): Promise<boolean> {
  try {
    const deployments: DeploymentData[] = JSON.parse(localStorage.getItem('deployments') || '[]');
    deployments.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('deployments', JSON.stringify(deployments));
    return true;
  } catch (error: unknown) {
    console.error('Error tracking deployment:', error instanceof Error ? error.message : error);
    return false;
  }
}

// Legacy function for backward compatibility
export const saveDeployment = trackDeployment;

// Utility function to get deployments from local storage
export const getDeployments = (): DeploymentData[] => {
  try {
    // First try the new format
    let data = localStorage.getItem('deployments');
    
    if (!data) {
      // Fall back to the old format
      data = localStorage.getItem('quicktoken_deployments');
    }
    
    return data ? JSON.parse(data) : [];
  } catch (error: unknown) {
    console.error("Error retrieving deployment data:", error instanceof Error ? error.message : error);
    return [];
  }
}; 