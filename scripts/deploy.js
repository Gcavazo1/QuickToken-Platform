// SPDX-License-Identifier: UNLICENSED
// QuickToken Platform - Proprietary License
// Copyright (c) 2023-2024 GigaCode (Gabriel Cavazos). All rights reserved.
// This code is licensed under a proprietary license.

const hre = require("hardhat");
const { ethers } = require("hardhat");
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in config folder
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to track deployment in Supabase
async function trackDeployment(data) {
  try {
    console.log("Tracking deployment in Supabase...");
    console.log("Supabase URL:", supabaseUrl ? "✓ Connected" : "❌ Missing");
    console.log("Using table: 'tokens'");
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("⚠️ Supabase credentials missing. Skipping database tracking.");
      return false;
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
      return false;
    }
    
    console.log("\n✅ Deployment successfully tracked in database!");
    if (result && result.length > 0) {
      console.log("Token ID:", result[0].id);
    }
    return true;
  } catch (error) {
    console.error("\n=== Unexpected Error in trackDeployment ===");
    console.error(error);
    return false;
  }
}

// Helper to get explorer URL based on network
function getExplorerUrl(network, address) {
  const explorers = {
    'mainnet': 'https://etherscan.io/token/',
    'sepolia': 'https://sepolia.etherscan.io/token/',
    'goerli': 'https://goerli.etherscan.io/token/',
    'polygon': 'https://polygonscan.com/token/',
    'mumbai': 'https://mumbai.polygonscan.com/token/',
    'arbitrum': 'https://arbiscan.io/token/',
    'optimism': 'https://optimistic.etherscan.io/token/',
    'base': 'https://basescan.org/token/',
    'localhost': 'http://localhost:8545/token/',
    'hardhat': 'http://localhost:8545/token/'
  };
  
  return `${explorers[network] || explorers['mainnet']}${address}`;
}

/**
 * Validate an Ethereum address
 * @param address The address to validate
 * @returns Whether the address is valid
 */
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

/**
 * Validate platform settings
 * @param platformAddress The platform wallet address
 * @param platformFeePercentage The platform fee percentage
 * @returns The validated settings
 */
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
      // Ensure the address is checksummed (ethers v6 syntax)
      const validatedAddress = ethers.getAddress(platformAddress);
      return { platformAddress: validatedAddress, platformFeePercentage };
    } catch (error) {
      throw new Error(`Invalid platform address format: ${platformAddress}`);
    }
  }
  
  return { platformAddress, platformFeePercentage };
}

const deployContract = async (
  tokenName,
  tokenSymbol,
  maxSupply,
  mintFee,
  lockDuration,
  platformAddress,
  platformFeePercentage
) => {
  console.log('\n🚀 Starting deployment process...');
  
  // Get the deployer account
  const [signer] = await ethers.getSigners();
  
  // Set deployment options with higher gas limit
  const deployOptions = {
    gasLimit: 12000000 // 12 million gas units
  };

  try {
    // Try to get current gas price
    try {
      const feeData = await ethers.provider.getFeeData();
      if (feeData && feeData.gasPrice) {
        const gasPrice = feeData.gasPrice * BigInt(110) / BigInt(100); // Add 10% buffer
        deployOptions.gasPrice = gasPrice;
        console.log(`💰 Current gas price: ${ethers.formatUnits(gasPrice, 'gwei')} gwei (with 10% buffer)`);
      } else {
        console.log('⚠️ Unable to get gas price. Using default gas price.');
      }
    } catch (error) {
      console.log('⚠️ Error getting gas price. Using default gas price.');
      console.error(error);
    }

    // Log deployment parameters
    console.log('\n📝 Deployment parameters:');
    console.log(`   Token Name: ${tokenName}`);
    console.log(`   Token Symbol: ${tokenSymbol}`);
    console.log(`   Max Supply: ${maxSupply} tokens`);
    console.log(`   Mint Fee: ${ethers.formatEther(mintFee)} ETH`);
    console.log(`   Platform Address: ${platformAddress}`);
    console.log(`   Platform Fee: ${platformFeePercentage}%`);
    console.log(`   Lock Duration: ${lockDuration / 86400} days`);

    // Get the contract factory
    const QuickTokenFactory = await ethers.getContractFactory("QuickToken");
    
    // Deploy the contract with parameters
    console.log("Deploying contract...");
    const quickToken = await QuickTokenFactory.deploy(
      tokenName,
      tokenSymbol,
      maxSupply,
      mintFee,
      lockDuration,
      platformAddress,
      platformFeePercentage,
      deployOptions
    );
    
    // Wait for deployment to finish
    await quickToken.waitForDeployment();
    const contractAddress = await quickToken.getAddress();
    
    console.log(`QuickToken deployed successfully to: ${contractAddress}`);
    console.log(`Transaction hash: ${quickToken.deploymentTransaction().hash}`);
    
    // Additional info about verification
    console.log("\nTo verify this contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${tokenName}" "${tokenSymbol}" ${maxSupply} ${mintFee} ${lockDuration} ${platformAddress} ${platformFeePercentage}`);
    
    // Mint some tokens if on local network
    if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
      console.log("\nMinting 1000 tokens to deployer for testing...");
      const [signer] = await ethers.getSigners();
      const mintAmount = ethers.parseEther("1000");
      
      // Calculate total mint fee for 1000 tokens
      const totalMintFee = mintFee * BigInt(1000);
      console.log(`Total mint fee required: ${ethers.formatEther(totalMintFee)} ETH`);
      
      const mintTx = await quickToken.mint(signer.address, mintAmount, {
        value: totalMintFee
      });
      
      await mintTx.wait();
      console.log(`Minted ${ethers.formatEther(mintAmount)} tokens to ${signer.address}`);
    }

    // Track the deployment in Supabase
    await trackDeployment({
      contractAddress,
      tokenName,
      tokenSymbol,
      network: hre.network.name,
      deployerAddress: signer.address,
      transactionHash: quickToken.deploymentTransaction().hash,
      maxSupply: ethers.formatEther(maxSupply),
      mintFee: ethers.formatEther(mintFee),
      lockDuration: lockDuration / 86400, // Convert to days
      platformAddress,
      platformFeePercentage
    });

    // Deployment summary
    console.log("\n🎉 DEPLOYMENT SUMMARY 🎉");
    console.log("========================");
    console.log(`Contract:   ${tokenName} (${tokenSymbol})`);
    console.log(`Address:    ${contractAddress}`);
    console.log(`Network:    ${hre.network.name}`);
    console.log(`Max Supply: ${ethers.formatEther(maxSupply)} tokens`);
    console.log(`Mint Fee:   ${ethers.formatEther(mintFee)} ETH per token`);
    console.log(`Lock:       ${lockDuration / 86400} days`);
    console.log(`Platform:   ${platformAddress} (${platformFeePercentage}%)`);
    console.log(`Explorer:   ${getExplorerUrl(hre.network.name, contractAddress)}`);
    console.log("========================");

    return {
      success: true,
      address: contractAddress,
      txHash: quickToken.deploymentTransaction().hash,
      token: {
        name: tokenName,
        symbol: tokenSymbol,
        maxSupply: ethers.formatEther(maxSupply),
        mintFee: ethers.formatEther(mintFee),
        lockDuration: lockDuration / 86400, // Days
        platformAddress,
        platformFeePercentage
      }
    };
  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("===================");
    console.error(error);
    console.error("===================");
    
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log("Starting QuickToken deployment...");

  // -----------------------------------------------------
  // Set deployment parameters
  // -----------------------------------------------------
  const NAME = "QuickToken";
  const SYMBOL = "QTK";
  const MAX_SUPPLY = ethers.parseEther("1000000"); // 1 million tokens
  const MINT_FEE = ethers.parseEther("0.01"); // 0.01 ETH per mint
  const PLATFORM_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Update with your address
  const PLATFORM_FEE_PERCENT = 20; // 20%
  const LOCK_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds
  
  // Log deployment parameters
  console.log("Deployment Parameters:");
  console.log(`- Name: ${NAME}`);
  console.log(`- Symbol: ${SYMBOL}`);
  console.log(`- Max Supply: ${ethers.formatEther(MAX_SUPPLY)} tokens`);
  console.log(`- Mint Fee: ${ethers.formatEther(MINT_FEE)} ETH`);
  console.log(`- Platform Address: ${PLATFORM_ADDRESS}`);
  console.log(`- Platform Fee: ${PLATFORM_FEE_PERCENT}%`);
  console.log(`- Lock Duration: ${LOCK_DURATION / 86400} days`);
  
  return await deployContract(
    NAME,
    SYMBOL,
    MAX_SUPPLY,
    MINT_FEE,
    LOCK_DURATION,
    PLATFORM_ADDRESS,
    PLATFORM_FEE_PERCENT
  );
}

// Run the deployment
main()
  .then(result => {
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("===================");
    console.error(error);
    console.error("===================");
    
    process.exit(1);
  });

module.exports = { main, trackDeployment, isValidEthereumAddress };