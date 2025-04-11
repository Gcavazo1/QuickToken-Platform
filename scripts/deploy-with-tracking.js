/**
 * Comprehensive QuickToken deployment script
 * 
 * This script performs all steps needed to deploy and integrate a QuickToken contract:
 * 1. Compiles the contract
 * 2. Deploys to the specified network
 * 3. Tracks in Supabase database
 * 4. Copies artifacts to the web app
 * 5. Verifies the contract on Etherscan
 */

const hre = require("hardhat");
const { ethers } = require("hardhat");
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables from .env file in config folder
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to run system commands and return a promise
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Helper function to get explorer URL based on network
function getExplorerUrl(network, address, type = 'token') {
  const explorers = {
    'mainnet': 'https://etherscan.io',
    'sepolia': 'https://sepolia.etherscan.io',
    'goerli': 'https://goerli.etherscan.io',
    'polygon': 'https://polygonscan.com',
    'mumbai': 'https://mumbai.polygonscan.com',
    'arbitrum': 'https://arbiscan.io',
    'optimism': 'https://optimistic.etherscan.io',
    'base': 'https://basescan.org',
    'localhost': 'http://localhost:8545',
    'hardhat': 'http://localhost:8545'
  };
  
  const baseUrl = explorers[network] || explorers['mainnet'];
  const path = type === 'token' ? 'token' : 'tx';
  return `${baseUrl}/${path}/${address}`;
}

// Validate an Ethereum address
function isValidEthereumAddress(address) {
  if (!address) return false;
  
  try {
    // Check if address is valid format (ethers v6 syntax)
    const checksumAddress = ethers.getAddress(address);
    
    // Check if it's not the zero address
    return checksumAddress !== ethers.ZeroAddress;
  } catch (error) {
    console.error("Invalid Ethereum address:", address, error);
    return false;
  }
}

// Validate platform settings
function validatePlatformSettings(platformAddress, platformFeePercentage) {
  // Check if platform fee percentage is valid
  if (platformFeePercentage < 0 || platformFeePercentage > 100) {
    throw new Error(`Platform fee percentage must be between 0 and 100, got: ${platformFeePercentage}`);
  }

  // If platform fee is greater than 0, validate the platform address
  if (platformFeePercentage > 0) {
    if (!platformAddress || platformAddress === ethers.ZeroAddress) {
      throw new Error('Platform address must be a valid non-zero address when platform fee percentage is greater than 0');
    }
    
    if (!isValidEthereumAddress(platformAddress)) {
      throw new Error(`Invalid platform address format: ${platformAddress}`);
    }
    
    try {
      // Ensure the address is checksummed
      const validatedAddress = ethers.getAddress(platformAddress);
      return { platformAddress: validatedAddress, platformFeePercentage };
    } catch (error) {
      throw new Error(`Invalid platform address format: ${platformAddress}`);
    }
  }
  
  return { platformAddress, platformFeePercentage };
}

// Track deployment in Supabase
async function trackDeployment(data) {
  try {
    console.log("\nTracking deployment in Supabase...");
    console.log("Supabase URL:", supabaseUrl ? "✓ Connected" : "❌ Missing");
    console.log("Using table: 'tokens'");
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("⚠️ Supabase credentials missing. Skipping database tracking.");
      return null;
    }
    
    // Prepare data for Supabase based on the exact schema
    const deploymentData = {
      contract_address: data.contractAddress,
      name: data.tokenName,
      symbol: data.tokenSymbol,
      supply: data.maxSupply,
      mint_fee: data.mintFee,
      lock_duration: Math.floor(data.lockDuration / 86400), // Convert seconds to days
      deployed_by: data.deployerAddress,
      network: data.network,
      deployment_tx: data.transactionHash,
      deployment_date: new Date().toISOString()
      // id is auto-generated
      // client_id is optional and not provided in our deployment flow
    };
    
    // Get explorer URL for display only (not stored in DB)
    const explorerUrl = getExplorerUrl(data.network, data.contractAddress);
    console.log(`Explorer URL: ${explorerUrl} (not stored in database)`);
    
    console.log("Prepared data:", JSON.stringify(deploymentData, null, 2));
    
    // Insert into Supabase
    const { data: result, error } = await supabase
      .from('tokens')
      .insert([deploymentData])
      .select();
    
    if (error) {
      console.error("\n=== Supabase Insert Error ===");
      console.error(error);
      return null;
    }
    
    console.log("\n✅ Deployment successfully tracked in database!");
    const trackingId = result && result.length > 0 ? result[0].id : null;
    if (trackingId) {
      console.log("Token Record ID:", trackingId);
    }
    return trackingId;
  } catch (error) {
    console.error("\n=== Unexpected Error in trackDeployment ===");
    console.error(error);
    return null;
  }
}

// Update deployment verification status in Supabase
async function updateVerificationStatus(trackingId, verified) {
  // Since the Supabase schema doesn't have a verification column, we'll just log the status
  console.log(`\nVerification status: ${verified ? 'verified' : 'failed'}`);
  console.log("Note: Verification status is not stored in the database based on current schema.");
  
  // Keep interface the same for backwards compatibility
  return true;
}

// Copy artifacts to web app
function copyArtifactsToWeb() {
  console.log('\nCopying contract artifacts to web app...');
  
  try {
    // Paths
    const artifactsDir = path.join(__dirname, '../artifacts/contracts');
    const webContractsDir = path.join(__dirname, '../quicktoken-kit-web/src/contracts');
    
    // Ensure target directory exists
    if (!fs.existsSync(webContractsDir)) {
      console.log(`Creating web contracts directory: ${webContractsDir}`);
      fs.mkdirSync(webContractsDir, { recursive: true });
    }
    
    // Find the QuickToken.sol directory
    const quickTokenDir = path.join(artifactsDir, 'QuickToken.sol');
    
    if (!fs.existsSync(quickTokenDir)) {
      console.error(`QuickToken artifacts not found at ${quickTokenDir}`);
      return false;
    }
    
    // Copy the QuickToken.json file
    const sourceFile = path.join(quickTokenDir, 'QuickToken.json');
    const destFile = path.join(webContractsDir, 'QuickToken.json');
    
    if (!fs.existsSync(sourceFile)) {
      console.error(`QuickToken.json not found at ${sourceFile}`);
      return false;
    }
    
    // Read the contract artifact
    const contractArtifact = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    
    // Create a simplified version with just abi and bytecode
    const simplifiedArtifact = {
      contractName: contractArtifact.contractName,
      abi: contractArtifact.abi,
      bytecode: contractArtifact.bytecode,
      // Add metadata useful for the web app
      metadata: {
        compiler: {
          version: contractArtifact.metadata ? JSON.parse(contractArtifact.metadata).compiler.version : 'unknown'
        }
      }
    };
    
    // Write the simplified artifact to the web app directory
    fs.writeFileSync(
      destFile, 
      JSON.stringify(simplifiedArtifact, null, 2)
    );
    
    console.log(`✅ Successfully copied QuickToken artifacts to: ${destFile}`);
    console.log(`ABI contains ${simplifiedArtifact.abi.length} functions/events`);
    
    return true;
  } catch (error) {
    console.error('Error copying artifacts:', error);
    return false;
  }
}

// Main deployment function
async function deploy() {
  const startTime = Date.now();
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     QUICKTOKEN DEPLOYMENT WITH TRACKING          ║');
  console.log('╚══════════════════════════════════════════════════╝');
  
  try {
    // 1. Compile the contract
    console.log('\n📝 STEP 1: Compiling contract...');
    await runCommand('npx hardhat compile');
    console.log('✅ Compilation successful!');
    
    // Copy artifacts to web app (first time)
    copyArtifactsToWeb();
    
    // 2. Get network information
    const networkName = hre.network.name;
    console.log(`\n🌐 STEP 2: Preparing to deploy to network: ${networkName}`);
    
    // 3. Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`\n👤 STEP 3: Deploying with account: ${deployer.address}`);
    
    // Get balance with ethers v6 syntax
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

    // 4. Define constructor arguments
    console.log('\n📋 STEP 4: Setting deployment parameters');
    const tokenName = process.env.TOKEN_NAME || "QuickToken";
    const tokenSymbol = process.env.TOKEN_SYMBOL || "QTK";
    const maxSupply = ethers.parseUnits(process.env.MAX_SUPPLY || "1000000", 18); // 1 Million tokens with 18 decimals
    const mintFee = ethers.parseEther(process.env.MINT_FEE || "0.01"); // 0.01 ETH mint fee per token
    const lockDuration = (parseInt(process.env.LOCK_DURATION || "30")) * 24 * 60 * 60; // 30 days lock duration in seconds
    
    // Platform fee configuration
    let platformAddress = process.env.PLATFORM_WALLET_ADDRESS || deployer.address;
    let platformFeePercentage = process.env.PLATFORM_FEE_PERCENTAGE ? parseInt(process.env.PLATFORM_FEE_PERCENTAGE) : 20;

    // Validate platform settings
    const validatedSettings = validatePlatformSettings(platformAddress, platformFeePercentage);
    platformAddress = validatedSettings.platformAddress;
    platformFeePercentage = validatedSettings.platformFeePercentage;

    console.log(`Token Name: ${tokenName}`);
    console.log(`Token Symbol: ${tokenSymbol}`);
    console.log(`Max Supply: ${ethers.formatUnits(maxSupply, 18)}`);
    console.log(`Mint Fee: ${ethers.formatEther(mintFee)} ETH per token`);
    console.log(`Lock Duration: ${lockDuration} seconds (${lockDuration / 86400} days)`);
    console.log(`Platform Address: ${platformAddress}`);
    console.log(`Platform Fee Percentage: ${platformFeePercentage}%`);

    // 5. Get deployment options
    console.log('\n⚙️ STEP 5: Setting deployment options');
    const deployOptions = {
      gasLimit: 12000000, // Higher gas limit to accommodate complex contract initialization
    };

    try {
      // Get current gas price to optimize deployment cost
      const feeData = await ethers.provider.getFeeData();
      
      if (feeData.gasPrice) {
        // Add 10% buffer to current gas price
        const adjustedGasPrice = feeData.gasPrice * BigInt(110) / BigInt(100);
        deployOptions.gasPrice = adjustedGasPrice;
        console.log(`Current gas price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei (using ${ethers.formatUnits(adjustedGasPrice, 'gwei')} gwei with buffer)`);
      } else {
        console.log("Failed to get gas price, using default");
      }
    } catch (error) {
      console.log("Error getting gas price:", error.message);
    }
    
    console.log(`Gas Limit: ${deployOptions.gasLimit.toString()}`);
    
    // 6. Deploy the contract
    console.log('\n🚀 STEP 6: Deploying contract...');
    const QuickToken = await ethers.getContractFactory("QuickToken");
    
    console.log("Deploying contract...");
    const quickToken = await QuickToken.deploy(
      tokenName,
      tokenSymbol,
      maxSupply,
      mintFee,
      lockDuration,
      platformAddress,
      platformFeePercentage,
      deployOptions
    );

    // 7. Wait for deployment to finish
    console.log("Waiting for transaction to be mined...");
    await quickToken.waitForDeployment();
    const contractAddress = await quickToken.getAddress();
    
    // Get deployment transaction
    const tx = quickToken.deploymentTransaction();
    const txHash = tx.hash;
    
    console.log(`\n✅ Contract deployed successfully!`);
    console.log(`Contract address: ${contractAddress}`);
    console.log(`Transaction hash: ${txHash}`);
    console.log(`Explorer: ${getExplorerUrl(networkName, contractAddress)}`);
    
    // 8. Track the deployment in Supabase
    console.log(`\n📊 STEP 7: Tracking deployment...`);
    const trackingId = await trackDeployment({
      contractAddress,
      tokenName,
      tokenSymbol,
      network: networkName,
      deployerAddress: deployer.address,
      transactionHash: txHash,
      maxSupply: ethers.formatUnits(maxSupply, 18),
      mintFee: ethers.formatEther(mintFee),
      lockDuration: lockDuration / 86400, // Convert to days
      platformAddress,
      platformFeePercentage,
      verified: false
    });
    
    // 9. Copy artifacts to web app (ensure latest)
    console.log(`\n📦 STEP 8: Copying artifacts to web app...`);
    const artifactsCopied = copyArtifactsToWeb();
    if (!artifactsCopied) {
      console.warn("⚠️ Failed to copy artifacts to web app");
    }
    
    // 10. Verify contract on Etherscan (if not on local network)
    let verified = false;
    if (networkName !== 'localhost' && networkName !== 'hardhat') {
      console.log(`\n🔍 STEP 9: Verifying contract on Etherscan...`);
      
      // Wait a bit for the transaction to be fully registered
      console.log("Waiting 10 seconds before verification...");
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      try {
        const verifyCommand = `npx hardhat verify --network ${networkName} ${contractAddress} "${tokenName}" "${tokenSymbol}" ${maxSupply} ${mintFee} ${lockDuration} ${platformAddress} ${platformFeePercentage}`;
        await runCommand(verifyCommand);
        console.log("\n✅ Contract verified successfully!");
        verified = true;
      } catch (error) {
        console.error("⚠️ Verification failed:", error.message);
        console.log("\nYou can manually verify the contract later with:");
        console.log(`npx hardhat verify --network ${networkName} ${contractAddress} "${tokenName}" "${tokenSymbol}" ${maxSupply} ${mintFee} ${lockDuration} ${platformAddress} ${platformFeePercentage}`);
      }
      
      // Update verification status in database
      if (trackingId) {
        await updateVerificationStatus(trackingId, verified);
      }
    } else {
      console.log(`\n🔍 STEP 9: Skipping verification (local network)`);
    }
    
    // 11. Mint tokens on local networks for testing
    if (networkName === 'localhost' || networkName === 'hardhat') {
      console.log("\n🪙 Minting initial tokens for testing...");
      
      // Calculate the mint fee in ETH for 100 tokens
      const demoAmount = ethers.parseUnits("100", 18); // 100 tokens
      const mintFeeTotal = demoAmount * mintFee / ethers.parseUnits("1", 18);
      const feeRequired = ethers.formatEther(mintFeeTotal);
      
      console.log(`Minting ${ethers.formatUnits(demoAmount, 18)} tokens to owner with a fee of ${feeRequired} ETH...`);
      
      // Call the mint function with the required value
      const mintTx = await quickToken.mint(deployer.address, demoAmount, {
        value: ethers.parseEther(feeRequired)
      });
      
      await mintTx.wait();
      console.log(`✅ Successfully minted ${ethers.formatUnits(demoAmount, 18)} tokens to owner!`);
      
      // Check balance after minting
      const balance = await quickToken.balanceOf(deployer.address);
      console.log(`Owner token balance: ${ethers.formatUnits(balance, 18)} ${tokenSymbol}`);
    }
    
    // 12. Deployment summary
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // in seconds
    
    console.log("\n╔═════════════════════════════════════════════════╗");
    console.log("║               DEPLOYMENT SUMMARY                ║");
    console.log("╚═════════════════════════════════════════════════╝");
    console.log(`⏱️ Deployment duration: ${duration.toFixed(2)} seconds`);
    console.log(`📝 Contract name: ${tokenName} (${tokenSymbol})`);
    console.log(`📍 Contract address: ${contractAddress}`);
    console.log(`🌐 Network: ${networkName}`);
    console.log(`📊 Max supply: ${ethers.formatUnits(maxSupply, 18)} tokens`);
    console.log(`💰 Mint fee: ${ethers.formatEther(mintFee)} ETH per token`);
    console.log(`🔒 Lock duration: ${lockDuration / 86400} days`);
    console.log(`👤 Platform address: ${platformAddress}`);
    console.log(`💸 Platform fee: ${platformFeePercentage}%`);
    console.log(`🔗 Explorer: ${getExplorerUrl(networkName, contractAddress)}`);
    console.log(`✅ Verified: ${verified ? 'Yes' : 'No'}`);
    console.log(`📊 Database tracking: ${trackingId ? 'Success' : 'Failed'}`);
    console.log(`📦 Artifacts copied: ${artifactsCopied ? 'Success' : 'Failed'}`);
    console.log("═════════════════════════════════════════════════");
    
    return {
      success: true,
      address: contractAddress,
      txHash,
      network: networkName,
      verified,
      trackingId,
      token: {
        name: tokenName,
        symbol: tokenSymbol,
        maxSupply: ethers.formatUnits(maxSupply, 18),
        mintFee: ethers.formatEther(mintFee),
        lockDuration: lockDuration / 86400, // Days
        platformAddress,
        platformFeePercentage
      }
    };
  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("═════════════════════════════════════════════════");
    console.error(error);
    console.error("═════════════════════════════════════════════════");
    
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
}

// Run if script is executed directly
if (require.main === module) {
  deploy()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { deploy, trackDeployment, updateVerificationStatus, copyArtifactsToWeb };