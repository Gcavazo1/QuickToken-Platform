import Head from 'next/head';
import { useState, FormEvent, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWeb3React } from '@web3-react/core';
import { injectedConnector, shortenAddress, Web3ProviderCompatibility } from '../utils/web3';
import { ethers } from 'ethers';
import AnimatedGlow from '../components/AnimatedGlow';
import FeeDisclosure from '../components/FeeDisclosure';
import { createClient } from '@supabase/supabase-js';
import feeConfig, { isValidEthereumAddress as validateEthAddress, DEFAULT_TOKEN_SETTINGS } from '../utils/feeConfig';

// Import QuickToken ABI
import QuickTokenABI from '../contracts/QuickToken.json';

// Update the type for web3-react compatibility
type Web3Provider = Web3ProviderCompatibility;
type Web3Signer = ethers.JsonRpcSigner;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface FormData {
  name: string;
  symbol: string;
  maxSupply: string;
  mintFee: string;
  lockDuration: string;
}

interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  tokenName: string;
  tokenSymbol: string;
  maxSupply: string;
  mintFee: string;
  lockDuration: string;
  network: string;
}

// Define interface for Ethereum transaction errors
interface EthersError extends Error {
  code?: string;
  reason?: string;
  action?: string;
  data?: string;
  method?: string;
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
  [key: string]: any;
}

// Add this function near the top after your imports
const validateContractParameters = (
  name: string,
  symbol: string,
  maxSupply: bigint,
  mintFee: bigint,
  lockDuration: number,
  platformAddress: string,
  platformFeePercentage: number
): { valid: boolean; error?: string } => {
  // Basic validations
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Token name is required' };
  }

  if (!symbol || symbol.trim() === '') {
    return { valid: false, error: 'Token symbol is required' };
  }

  if (maxSupply <= 0n) {
    return { valid: false, error: 'Max supply must be greater than zero' };
  }

  if (mintFee < 0n) {
    return { valid: false, error: 'Mint fee cannot be negative' };
  }

  if (lockDuration < 0) {
    return { valid: false, error: 'Lock duration cannot be negative' };
  }

  if (platformFeePercentage < 0 || platformFeePercentage > 100) {
    return { valid: false, error: 'Platform fee percentage must be between 0 and 100' };
  }

  // Check platform address is valid when fee percentage is > 0
  if (platformFeePercentage > 0) {
    if (!platformAddress || platformAddress === '0x0000000000000000000000000000000000000000' || platformAddress === ethers.ZeroAddress) {
      return { 
        valid: false, 
        error: 'Platform address must be a valid non-zero address when platform fee percentage is greater than 0' 
      };
    }
    
    // Use the imported validation function
    if (!validateEthAddress(platformAddress)) {
      return { 
        valid: false, 
        error: 'Platform address is not a valid Ethereum address' 
      };
    }
  }

  return { valid: true };
};

// Use ethers.js utilities to validate Ethereum addresses
const isValidEthereumAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Check if it's the zero address
  if (address === '0x0000000000000000000000000000000000000000' || address === ethers.ZeroAddress) {
    return false;
  }
  
  try {
    // Use ethers.js to validate the address (checks format and checksum)
    ethers.getAddress(address);
    return true;
  } catch (error) {
    console.error("Invalid Ethereum address:", address, error);
    return false;
  }
};

// Add this function after the other helper functions

/**
 * Generates a helpful error message based on contract revert reason
 */
const getContractErrorMessage = (error: any): string => {
  // Base message
  let message = "Contract deployment failed. ";
  
  // Try to extract useful information from the error
  if (error && error.reason) {
    message += `Reason: ${error.reason}. `;
  }
  
  // Look for specific error messages in the error or transaction data
  let errorString = '';
  if (error.message) {
    errorString = error.message;
  } else if (error.error && error.error.message) {
    errorString = error.error.message;
  }
  
  // Check for specific known error conditions based on the error message
  if (errorString.includes("max supply") || errorString.includes("maxSupply") || 
      (error.data && error.data.includes("maxSupply"))) {
    message += "Max supply must be greater than zero. ";
  }
  
  if (errorString.includes("platform fee percentage")) {
    message += "Platform fee percentage must be between 0 and 100. ";
  }
  
  // Specific check for platform address issues
  if (errorString.includes("platform address") || 
      errorString.includes("platformAddress") || 
      errorString.includes("zero address")) {
    message += "When platform fee percentage > 0, platform address must be a valid non-zero address. ";
  }
  
  // Common errors
  if (errorString.includes("insufficient funds")) {
    message += "You don't have enough ETH to pay for this transaction. ";
  }
  
  if (errorString.includes("gas required exceeds allowance")) {
    message += "Gas estimation failed. The transaction might revert during execution. ";
  }
  
  // General guidance
  message += "Please check your parameters and try again. Recommended values for testing: " +
    "Name and symbol as non-empty strings, " +
    "Max supply of 1,000,000 tokens, " +
    "Mint fee of 0.01 ETH per token, " +
    "Lock duration of 30 days, " +
    "Platform address as your wallet address, " +
    "Platform fee of 20%.";
  
  return message;
};

export default function DApp() {
  const { active, account, activate, library, chainId, error: web3Error } = useWeb3React<any>();
  const { platformFeePercentage, defaultMintFee } = feeConfig;
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    maxSupply: DEFAULT_TOKEN_SETTINGS.initialSupply,
    mintFee: DEFAULT_TOKEN_SETTINGS.mintFee,
    lockDuration: DEFAULT_TOKEN_SETTINGS.lockDuration
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [contractCopySuccess, setContractCopySuccess] = useState(false);
  const [txCopySuccess, setTxCopySuccess] = useState(false);

  // Get network name
  const getNetworkName = (chainId: number | undefined): string => {
    if (!chainId) return 'Unknown Network';
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten',
      4: 'Rinkeby',
      5: 'Goerli',
      42: 'Kovan',
      11155111: 'Sepolia',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      31337: 'Hardhat Local',
      1337: 'Localhost'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      console.log("Attempting to connect wallet...");
      await activate(injectedConnector);
      console.log("Wallet connection successful:", {
        chainId: await injectedConnector.getChainId(),
        account: await injectedConnector.getAccount()
      });
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    }
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    console.log("Checking for previous wallet connection...");
    injectedConnector.isAuthorized().then((isAuthorized) => {
      console.log("Wallet previously authorized:", isAuthorized);
      if (isAuthorized) {
        console.log("Auto-connecting previously authorized wallet...");
        activate(injectedConnector)
          .then(() => console.log("Auto-connect successful"))
          .catch(err => console.error("Auto-connect failed:", err));
      }
    });
  }, [activate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update copyToClipboard function to handle different types
  const copyToClipboard = async (text: string, type: 'contract' | 'transaction') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'contract') {
        setContractCopySuccess(true);
        setTimeout(() => setContractCopySuccess(false), 2000);
      } else {
        setTxCopySuccess(true);
        setTimeout(() => setTxCopySuccess(false), 2000);
      }
      console.log(`${type} copied to clipboard:`, text);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        if (type === 'contract') {
          setContractCopySuccess(true);
          setTimeout(() => setContractCopySuccess(false), 2000);
        } else {
          setTxCopySuccess(true);
          setTimeout(() => setTxCopySuccess(false), 2000);
        }
      } catch (e) {
        console.error('Fallback copy method failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  // Generate Etherscan URL based on network
  const getEtherscanUrl = (address: string, isToken: boolean = true): string => {
    let baseUrl;
    
    // Determine the base URL based on chainId
    switch (chainId) {
      case 1: // Ethereum mainnet
        baseUrl = 'https://etherscan.io';
        break;
      case 5: // Goerli testnet
        baseUrl = 'https://goerli.etherscan.io';
        break;
      case 11155111: // Sepolia testnet
        baseUrl = 'https://sepolia.etherscan.io';
        break;
      case 137: // Polygon mainnet
        baseUrl = 'https://polygonscan.com';
        break;
      case 80001: // Polygon Mumbai
        baseUrl = 'https://mumbai.polygonscan.com';
        break;
      default:
        // Default to Sepolia if we can't determine the network
        baseUrl = 'https://sepolia.etherscan.io';
    }
    
    // Different paths for token vs transaction
    return isToken 
      ? `${baseUrl}/token/${address}`
      : `${baseUrl}/tx/${address}`;
  };

  // Enhance viewOnEtherscan with explicit event handling
  const viewOnEtherscan = (address: string, isToken: boolean = true, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!address) return;
    
    console.log('Opening Etherscan for:', address, 'isToken:', isToken);
    const url = getEtherscanUrl(address, isToken);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Enhance resetDeploymentForm with explicit event handling
  const resetDeploymentForm = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Resetting deployment form');
    setDeploymentResult(null);
    // Reset the form to default values
    setFormData({
      name: '',
      symbol: '',
      maxSupply: DEFAULT_TOKEN_SETTINGS.initialSupply,
      mintFee: DEFAULT_TOKEN_SETTINGS.mintFee,
      lockDuration: DEFAULT_TOKEN_SETTINGS.lockDuration
    });
  };

  // Track deployment in Supabase
  const trackDeployment = async (data: DeploymentResult): Promise<string | null> => {
    try {
      console.log("\n========== SUPABASE TRACKING DEBUG ==========");
      console.log("Tracking deployment in Supabase...");
      console.log("Environment variables check:");
      console.log("- NEXT_PUBLIC_SUPABASE_URL exists:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Yes" : "No");
      console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY exists:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Yes" : "No");
      console.log("- URL value:", supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : "Missing");
      console.log("- Key value:", supabaseKey ? `${supabaseKey.substring(0, 10)}...` : "Missing");
      
      if (!supabaseUrl || !supabaseKey) {
        console.log("⚠️ Supabase credentials missing. Ensure these are properly set in your .env.local file.");
        setDetailedError("Supabase credentials missing. Check your environment variables in .env.local");
        return null;
      }

      // First, test the connection with a simple query
      console.log("Testing Supabase connection...");
      const { data: testData, error: testError } = await supabase
        .from('tokens')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error("⚠️ Supabase connection test failed:", testError);
        console.error("Error code:", testError.code);
        console.error("Error message:", testError.message);
        setDetailedError(`Supabase connection error: ${testError.message}`);
        return null;
      } else {
        console.log("✅ Supabase connection successful!");
      }
      
      // Try Insert to TOKENS table (lowercase)
      console.log("\n--- TOKENS TABLE INSERT ---");
      
      // Convert all numeric values properly
      const numericSupply = parseFloat(data.maxSupply);
      const numericMintFee = parseFloat(data.mintFee);
      const numericLockDuration = parseInt(data.lockDuration);
      
      const tokensData = {
        contract_address: data.contractAddress,
        name: data.tokenName,
        symbol: data.tokenSymbol,
        supply: numericSupply, // Send as number
        mint_fee: numericMintFee, // Send as number
        lock_duration: numericLockDuration, // Send as integer
        deployed_by: account || "",
        network: data.network,
        deployment_tx: data.transactionHash,
        deployment_date: new Date().toISOString()
      };
      
      console.log("Tokens data:", JSON.stringify(tokensData, null, 2));
      
      console.log("Inserting into lowercase 'tokens' table...");
      const { data: tokensResult, error: tokensError } = await supabase
        .from('tokens')
        .insert([tokensData]);
      
      if (tokensError) {
        console.error("Error inserting into tokens table:", tokensError);
        console.error("Error code:", tokensError.code);
        console.error("Error details:", JSON.stringify(tokensError));
      } else {
        console.log("✅ Successfully inserted into tokens table!");
      }
      
      // Try Insert to DEPLOYMENTS table (lowercase)
      console.log("\n--- DEPLOYMENTS TABLE INSERT ---");
      
      const deploymentsData = {
        project_name: data.tokenName,
        wallet_address: account || "",
        contract_address: data.contractAddress,
        network: data.network,
        status: 'success',
        notes: `Deployed via QuickToken dapp, symbol: ${data.tokenSymbol}, supply: ${data.maxSupply}`,
        token_symbol: data.tokenSymbol,
        transaction_hash: data.transactionHash,
        token_params: {
          name: data.tokenName,
          symbol: data.tokenSymbol,
          maxSupply: data.maxSupply,
          mintFee: data.mintFee,
          lockDuration: data.lockDuration
        },
        success: true
      };
      
      console.log("Deployments data:", JSON.stringify(deploymentsData, null, 2));
      
      console.log("Inserting into lowercase 'deployments' table...");
      const { data: deploymentsResult, error: deploymentsError } = await supabase
        .from('deployments')
        .insert([deploymentsData]);
      
      if (deploymentsError) {
        console.error("Error inserting into deployments table:", deploymentsError);
        console.error("Error code:", deploymentsError.code);
        console.error("Error details:", JSON.stringify(deploymentsError));
      } else {
        console.log("✅ Successfully inserted into deployments table!");
      }
      
      console.log("\n====== SUPABASE TRACKING SUMMARY ======");
      if (tokensError && deploymentsError) {
        console.error("❌ Failed to track deployment in both tables");
        setDetailedError(`Failed to track deployment. Tokens error: ${tokensError.message}, Deployments error: ${deploymentsError.message}`);
        return null;
      } else if (tokensError) {
        console.log("⚠️ Tokens table insert failed, but Deployments table successful");
        return "deployments-only";
      } else if (deploymentsError) {
        console.log("⚠️ Deployments table insert failed, but Tokens table successful");
        return "tokens-only";
      } else {
        console.log("✅ Successfully tracked deployment in both tables!");
        return "success";
      }
    } catch (error: any) {
      console.error("\n=== Unexpected Error in trackDeployment ===");
      console.error(error);
      setDetailedError(`Tracking error: ${error.message}`);
      return null;
    }
  };

  const deployToken = async () => {
    if (!active || !library) {
      setDeployError("Please connect your wallet first");
      console.log("Deployment attempted without active wallet connection");
      console.log("Active:", active, "Library:", library ? "exists" : "missing");
      return;
    }

    console.log("Starting deployment with:", {
      provider: library ? "Connected" : "Not connected",
      chainId: chainId || "unknown",
      account: account || "not connected"
    });

    setIsDeploying(true);
    setDeployError("");
    setDetailedError("");
    setDeploymentResult(null);

    try {
      // Validate inputs
      if (!formData.name || !formData.symbol) {
        throw new Error("Token name and symbol are required");
      }

      // Convert values to correct formats
      const maxSupply = ethers.parseUnits(formData.maxSupply || "0", 18);
      const mintFee = ethers.parseEther(formData.mintFee || "0");
      const lockDuration = parseInt(formData.lockDuration || "0") * 24 * 60 * 60; // Convert days to seconds

      // Validate platform address if platform fee is set
      if (platformFeePercentage > 0 && !validateEthAddress(feeConfig.platformWalletAddress)) {
        throw new Error("Invalid platform fee address. Please update your configuration.");
      }

      console.log('Using platform address:', feeConfig.platformWalletAddress);
      
      // Deploy the token
      const deployOptions = {
        gasLimit: 10000000, // 10 million gas
      };

      console.log('Deploying contract with parameters:');
      console.log('Name:', formData.name);
      console.log('Symbol:', formData.symbol);
      console.log('Max Supply:', maxSupply.toString());
      console.log('Mint Fee:', mintFee.toString());
      console.log('Lock Duration:', lockDuration, 'seconds');
      console.log('Platform Address:', feeConfig.platformWalletAddress);
      console.log('Platform Fee %:', platformFeePercentage);
      console.log('Gas Limit:', deployOptions.gasLimit);

      // Deploy the contract with constructor args and deployment options
      // Create contract factory
      const signer = await library.getSigner();
      console.log('Got signer:', signer ? 'Successfully obtained signer' : 'Failed to get signer');
      
      const factory = new ethers.ContractFactory(
        QuickTokenABI.abi,
        QuickTokenABI.bytecode,
        signer
      );
      
      console.log('Contract factory created');
      
      // Deploy contract with v6 syntax
      console.log('Sending deployment transaction...');
      const contract = await factory.deploy(
        formData.name,
        formData.symbol,
        maxSupply,
        mintFee,
        lockDuration,
        feeConfig.platformWalletAddress,
        platformFeePercentage,
        { gasLimit: deployOptions.gasLimit }
      );
      
      console.log('Contract deployment transaction sent. Waiting for confirmation...');
      const deployTx = contract.deploymentTransaction();
      if (!deployTx) {
        throw new Error('Failed to get deployment transaction');
      }
      console.log('Transaction hash:', deployTx.hash);
      
      // Wait for deployment to complete
      console.log('Waiting for deployment confirmation...');
      await contract.waitForDeployment();
      const deployedAddress = await contract.getAddress();
      console.log('Contract deployed at address:', deployedAddress);
    
      // Save deployment result
      const result: DeploymentResult = {
        contractAddress: deployedAddress,
        transactionHash: deployTx.hash,
        tokenName: formData.name,
        tokenSymbol: formData.symbol,
        maxSupply: formData.maxSupply,
        mintFee: formData.mintFee,
        lockDuration: formData.lockDuration,
        network: getNetworkName(chainId)
      };

      setDeploymentResult(result);
      console.log('Contract deployed successfully!');
      
      // Track deployment in Supabase if enabled
      console.log('Tracking deployment in Supabase...');
      const trackingId = await trackDeployment(result);
      console.log(trackingId ? 'Deployment tracked successfully with ID: ' + trackingId : 'Failed to track deployment');
    } catch (err: any) {
      console.error('Error deploying token:', err);
      
      // Handle user rejection
      if (err.code === "ACTION_REJECTED") {
        setDeployError("Transaction was rejected. Please try again.");
      } 
      // Handle execution errors
      else if (err.code === "CALL_EXCEPTION") {
        setDeployError(getContractErrorMessage(err));
      }
      // Generic error message
      else {
        setDeployError(err.message || "An unknown error occurred");
        if (err.message) {
          setDetailedError(err.message);
        } else if (err.error) {
          setDetailedError(JSON.stringify(err.error, null, 2));
        } else {
          setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        }
      }
    } finally {
      setIsDeploying(false);
    }
  };
  
  // Helper function to extract error message
  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message && typeof error.message === 'string') return error.message;
    return 'An error occurred with the wallet connection';
  };

  return (
    <>
      <Head>
        <title>Deploy Your Token | QuickToken Platform DApp</title>
        <meta name="description" content="Deploy your own ERC-20 token in minutes with QuickToken Platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-primary">
        <Header />
        
        <main className="flex-grow py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-center text-light-cyan">
                Deploy Your <span className="text-magenta">Token</span>
              </h1>
              
              {!active ? (
                <div className="text-center p-8 bg-space-navy rounded-lg shadow-lg">
                  <h2 className="text-2xl mb-6">Connect Your Wallet</h2>
                  <p className="mb-8 text-gray-300">
                    Connect your wallet to deploy your own custom ERC-20 token.
                  </p>
                  
                  {web3Error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-md text-red-300 font-sans">
                      <span className="font-mono text-sm whitespace-pre-wrap break-words">
                        {getErrorMessage(web3Error)}
                      </span>
                    </div>
                  )}
                  
                  <button 
                    onClick={connectWallet}
                    className="btn-primary btn-glow"
                  >
                    Connect with MetaMask
                  </button>
                </div>
              ) : deploymentResult ? (
                <div className="bg-space-navy relative border border-teal-500/50 rounded-lg shadow-xl p-8 backdrop-blur-sm">
                  <AnimatedGlow color="cyan" intensity="low" opacity={0.3} className="absolute inset-0 rounded-lg -z-10" />
                  
                  <div className="text-center">
                    <div className="inline-block mb-6">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto border border-green-500/50">
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-6 text-light-cyan">Token Deployed Successfully!</h2>
                    
                    {/* Token details */}
                    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-deep-blue bg-opacity-70 rounded-md">
                        <p className="text-sm text-gray-300 mb-1">Token Name</p>
                        <p className="font-bold text-white">{deploymentResult.tokenName}</p>
                      </div>
                      
                      <div className="p-4 bg-deep-blue bg-opacity-70 rounded-md">
                        <p className="text-sm text-gray-300 mb-1">Token Symbol</p>
                        <p className="font-bold text-white">{deploymentResult.tokenSymbol}</p>
                      </div>
                      
                      <div className="p-4 bg-deep-blue bg-opacity-70 rounded-md">
                        <p className="text-sm text-gray-300 mb-1">Total Supply</p>
                        <p className="font-bold text-white">{deploymentResult.maxSupply} {deploymentResult.tokenSymbol}</p>
                      </div>
                      
                      <div className="p-4 bg-deep-blue bg-opacity-70 rounded-md">
                        <p className="text-sm text-gray-300 mb-1">Network</p>
                        <p className="font-bold text-white">{deploymentResult.network}</p>
                      </div>
                    </div>
                    
                    {/* Contract Address */}
                    <div className="mb-6 p-4 bg-deep-blue bg-opacity-70 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-300">Contract Address:</p>
                        <button 
                          onClick={() => copyToClipboard(deploymentResult.contractAddress, 'contract')}
                          className="text-xs px-2 py-1 bg-deep-blue hover:bg-teal-700 hover:text-white rounded transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
                        >
                          {contractCopySuccess ? 'Copied! ✓' : 'Copy'}
                        </button>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <p className="font-mono text-white break-all text-lg tracking-wide">{deploymentResult.contractAddress}</p>
                        <div className="text-right">
                          <button 
                            onClick={(e) => viewOnEtherscan(deploymentResult.contractAddress, true, e)} 
                            className="text-xs px-2 py-1 text-teal hover:text-white hover:bg-teal-800/50 rounded transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
                          >
                            View contract on Etherscan
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Hash */}
                    <div className="mb-8 p-4 bg-deep-blue bg-opacity-70 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-300">Transaction Hash:</p>
                        <button 
                          onClick={() => copyToClipboard(deploymentResult.transactionHash, 'transaction')}
                          className="text-xs px-2 py-1 bg-deep-blue hover:bg-teal-700 hover:text-white rounded transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
                        >
                          {txCopySuccess ? 'Copied! ✓' : 'Copy'}
                        </button>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <p className="font-mono text-white break-all text-sm">{deploymentResult.transactionHash}</p>
                        <div className="text-right">
                          <button 
                            onClick={(e) => viewOnEtherscan(deploymentResult.transactionHash, false, e)} 
                            className="text-xs px-2 py-1 text-teal hover:text-white hover:bg-teal-800/50 rounded transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
                          >
                            View transaction on Etherscan
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                      <button 
                        onClick={(e) => viewOnEtherscan(deploymentResult.contractAddress, true, e)}
                        className="btn-secondary cursor-pointer relative overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-glow-teal active:scale-95"
                      >
                        <span className="relative z-10">View on Etherscan</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                      </button>
                      
                      <button 
                        onClick={(e) => resetDeploymentForm(e)}
                        className="btn-primary cursor-pointer relative overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-glow-cyan active:scale-95"
                      >
                        <span className="relative z-10">Deploy Another Token</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-space-navy rounded-lg shadow-lg p-8">
                  <div className="mb-6 p-4 rounded bg-deep-blue bg-opacity-50 flex items-center justify-between">
                    <span className="font-sans">Connected: {account && shortenAddress(account)}</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{getNetworkName(chainId)}</span>
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl mb-6 text-light-cyan">Token Configuration</h2>
                  
                  {deployError && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-md text-red-300 font-sans">
                      <p className="font-semibold mb-2">Error:</p>
                      <span className="font-mono block break-words whitespace-pre-wrap">
                        {deployError}
                      </span>
                      
                      {detailedError && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm hover:text-red-200">Show technical details</summary>
                          <pre className="mt-2 p-2 bg-black/30 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60">
                            {detailedError}
                          </pre>
                        </details>
                      )}
                      
                      <button 
                        onClick={() => {
                          setDeployError(null);
                          setDetailedError(null);
                        }}
                        className="mt-3 text-xs px-2 py-1 bg-red-800/30 hover:bg-red-800/50 rounded"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  
                  <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    deployToken();
                  }}>
                    <div>
                      <label className="block mb-2 text-light-cyan">Token Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. My Awesome Token" 
                        className="w-full p-3 rounded bg-white border border-deep-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-light-cyan">Token Symbol</label>
                      <input 
                        type="text" 
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        placeholder="e.g. MAT" 
                        className="w-full p-3 rounded bg-white border border-deep-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-light-cyan">
                        Total Supply
                        <span className="ml-1 text-xs text-gray-400">(max: 1 billion)</span>
                      </label>
                      <input 
                        type="number" 
                        name="maxSupply"
                        value={formData.maxSupply}
                        onChange={handleInputChange}
                        placeholder="1000000" 
                        className="w-full p-3 rounded bg-white border border-deep-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal font-sans"
                        required
                        min="1"
                        max="1000000000"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-light-cyan">Mint Fee (ETH per token)</label>
                      <input 
                        type="number" 
                        name="mintFee"
                        value={formData.mintFee}
                        onChange={handleInputChange}
                        placeholder="0.01" 
                        className="w-full p-3 rounded bg-white border border-deep-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal font-sans"
                        required
                        min="0"
                        step="0.001"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-light-cyan">
                        Time Lock (days)
                        <span className="ml-1 text-xs text-gray-400">(max: 365 days)</span>
                      </label>
                      <input 
                        type="number" 
                        name="lockDuration"
                        value={formData.lockDuration}
                        onChange={handleInputChange}
                        placeholder="7" 
                        className="w-full p-3 rounded bg-white border border-deep-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal font-sans"
                        required
                        min="0"
                        max="365"
                      />
                    </div>
                    
                    {/* Fee Disclosure - show platform address */}
                    <FeeDisclosure 
                      mintFee={formData.mintFee}
                      showDetails={true}
                    />
                    
                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="w-full btn-primary btn-glow"
                        disabled={isDeploying}
                      >
                        {isDeploying ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deploying...
                          </span>
                        ) : 'Deploy Token'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
