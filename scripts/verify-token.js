// QuickToken Kit - Proprietary License
// Copyright (c) 2023 GigaCode (Gabriel Cavazos). All rights reserved.
// This code is licensed under a proprietary license. See LICENSE file for details.

// This script verifies that a deployed QuickToken is functioning correctly
// Run with: npx hardhat run scripts/verify-token.js --network <network_name> <contract_address>

const { ethers } = require("hardhat");

async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  let contractAddress;
  
  // Parse command line arguments
  if (args.length === 0) {
    console.error("Error: Contract address not provided");
    console.log("Usage: npx hardhat run scripts/verify-token.js --network <network_name> <contract_address>");
    process.exit(1);
  } else {
    contractAddress = args[0];
  }
  
  console.log(`\n🔍 QUICKTOKEN VERIFICATION SCRIPT 🔍`);
  console.log(`Verifying token at address: ${contractAddress}\n`);
  
  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log(`Using account: ${signer.address}`);
  
  // Connect to the deployed contract
  const QuickToken = await ethers.getContractFactory("QuickToken");
  const token = QuickToken.attach(contractAddress);
  
  // Track verification results
  const results = {
    basicInfo: false,
    timeLock: false,
    minting: false,
    transferring: false,
    burning: false
  };
  
  try {
    // 1. Basic Information Check
    console.log("\n📋 BASIC INFORMATION CHECK");
    const name = await token.name();
    const symbol = await token.symbol();
    const maxSupply = await token.maxSupply();
    const mintFee = await token.mintFee();
    const owner = await token.owner();
    
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Max Supply: ${ethers.formatUnits(maxSupply, 18)}`);
    console.log(`Mint Fee: ${ethers.formatEther(mintFee)} ETH per token`);
    console.log(`Owner: ${owner}`);
    console.log(`✅ Basic information verified successfully`);
    results.basicInfo = true;
    
    // 2. Time Lock Check
    console.log("\n⏰ TIME LOCK CHECK");
    const unlockTime = await token.unlockTime();
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeUntilUnlock = await token.getTimeUntilUnlock();
    
    console.log(`Unlock Time: ${new Date(Number(unlockTime) * 1000).toLocaleString()}`);
    console.log(`Current Time: ${new Date(currentTimestamp * 1000).toLocaleString()}`);
    
    if (timeUntilUnlock > 0) {
      console.log(`Tokens are currently LOCKED (${ethers.formatUnits(timeUntilUnlock, 0)} seconds remaining)`);
    } else {
      console.log(`Tokens are UNLOCKED for transfers`);
    }
    console.log(`✅ Time lock status verified successfully`);
    results.timeLock = true;
    
    // 3. Balance Check
    console.log("\n💰 BALANCE CHECK");
    const signerBalance = await token.balanceOf(signer.address);
    console.log(`Your balance: ${ethers.formatUnits(signerBalance, 18)} ${symbol}`);
    
    // 4. Minting Test
    console.log("\n🔨 MINTING TEST");
    const mintAmount = ethers.parseUnits("1", 18); // Mint 1 token
    const requiredFee = await token.calculateMintFee(mintAmount);
    
    console.log(`Attempting to mint ${ethers.formatUnits(mintAmount, 18)} tokens...`);
    console.log(`Required fee: ${ethers.formatEther(requiredFee)} ETH`);
    
    try {
      const mintTx = await token.mint(signer.address, mintAmount, {
        value: requiredFee
      });
      
      console.log(`Transaction submitted: ${mintTx.hash}`);
      await mintTx.wait();
      
      const newBalance = await token.balanceOf(signer.address);
      console.log(`New balance: ${ethers.formatUnits(newBalance, 18)} ${symbol}`);
      
      if (newBalance > signerBalance) {
        console.log(`✅ Minting successful`);
        results.minting = true;
      } else {
        console.log(`❌ Minting failed - balance did not increase`);
      }
    } catch (error) {
      console.log(`❌ Minting failed: ${error.message}`);
    }
    
    // 5. Transfer Test
    console.log("\n💸 TRANSFER TEST");
    const transferAmount = ethers.parseUnits("0.5", 18); // Transfer 0.5 tokens
    
    // Create a random recipient address (never use in production!)
    const randomWallet = ethers.Wallet.createRandom();
    console.log(`Attempting to transfer ${ethers.formatUnits(transferAmount, 18)} tokens to ${randomWallet.address}...`);
    
    try {
      const transferTx = await token.transfer(randomWallet.address, transferAmount);
      console.log(`Transaction submitted: ${transferTx.hash}`);
      await transferTx.wait();
      
      const recipientBalance = await token.balanceOf(randomWallet.address);
      console.log(`Recipient balance: ${ethers.formatUnits(recipientBalance, 18)} ${symbol}`);
      
      if (recipientBalance >= transferAmount) {
        console.log(`✅ Transfer successful`);
        results.transferring = true;
      } else {
        console.log(`❌ Transfer failed - recipient did not receive tokens`);
      }
    } catch (error) {
      if (error.message.includes("Transfers are time-locked")) {
        console.log(`ℹ️ Transfer failed because tokens are time-locked (expected behavior)`);
        results.transferring = true; // We consider this a success because it's behaving as expected
      } else {
        console.log(`❌ Transfer failed: ${error.message}`);
      }
    }
    
    // 6. Burn Test
    console.log("\n🔥 BURN TEST");
    const burnAmount = ethers.parseUnits("0.25", 18); // Burn 0.25 tokens
    const balanceBeforeBurn = await token.balanceOf(signer.address);
    
    console.log(`Balance before burning: ${ethers.formatUnits(balanceBeforeBurn, 18)} ${symbol}`);
    console.log(`Attempting to burn ${ethers.formatUnits(burnAmount, 18)} tokens...`);
    
    try {
      const burnTx = await token.burn(burnAmount);
      console.log(`Transaction submitted: ${burnTx.hash}`);
      await burnTx.wait();
      
      const balanceAfterBurn = await token.balanceOf(signer.address);
      console.log(`Balance after burning: ${ethers.formatUnits(balanceAfterBurn, 18)} ${symbol}`);
      
      if (balanceAfterBurn < balanceBeforeBurn) {
        console.log(`✅ Burning successful`);
        results.burning = true;
      } else {
        console.log(`❌ Burning failed - balance did not decrease`);
      }
    } catch (error) {
      console.log(`❌ Burning failed: ${error.message}`);
    }
    
    // 7. Verification Summary
    console.log("\n📊 VERIFICATION SUMMARY");
    console.log(`Basic Information: ${results.basicInfo ? '✅' : '❌'}`);
    console.log(`Time Lock: ${results.timeLock ? '✅' : '❌'}`);
    console.log(`Minting: ${results.minting ? '✅' : '❌'}`);
    console.log(`Transferring: ${results.transferring ? '✅' : '❌'}`);
    console.log(`Burning: ${results.burning ? '✅' : '❌'}`);
    
    const overallResult = Object.values(results).every(result => result);
    console.log(`\nOverall Verification: ${overallResult ? '✅ PASSED' : '❌ FAILED'}`);
    
  } catch (error) {
    console.error(`\n❌ Verification script failed: ${error.message}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 