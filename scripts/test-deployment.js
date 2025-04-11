// Test script to verify deployment process
const { main, trackDeployment } = require('./deploy');
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function testDeployment() {
  console.log('Starting deployment test...');
  console.log(`Network: ${hre.network.name}`);
  
  try {
    // Get current ethers version 
    console.log(`Ethers.js version: ${ethers.version || 'unknown'}`);
    
    // Verify we can get signers with ethers v6
    const [deployer] = await ethers.getSigners();
    console.log('Test 1: Get signer - PASSED');
    
    // Verify we can get balance with ethers v6
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Test 2: Get balance (${ethers.formatEther(balance)} ETH) - PASSED`);
    
    // Verify we can get fee data with ethers v6
    const feeData = await ethers.provider.getFeeData();
    console.log(`Test 3: Get fee data - PASSED (Gas Price: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' gwei' : 'N/A'})`);
    
    // Verify Supabase tracking
    console.log('\nTesting Supabase tracking...');
    const mockDeploymentData = {
      contractAddress: '0x0000000000000000000000000000000000000000',
      tokenName: 'TestToken',
      tokenSymbol: 'TST',
      network: 'hardhat',
      deployerAddress: deployer.address,
      transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      maxSupply: '1000000',
      mintFee: '0.01',
      lockDuration: 30,
      platformAddress: deployer.address,
      platformFeePercentage: 20
    };
    
    const trackingResult = await trackDeployment(mockDeploymentData);
    if (trackingResult) {
      console.log('Test 4: Supabase tracking - PASSED');
    } else {
      console.log('Test 4: Supabase tracking - FAILED (but continuing)');
    }
    
    // Full deployment test
    console.log('\nRunning full deployment test...');
    const deploymentResult = await main();
    
    console.log('\nDeployment test completed:');
    console.log(JSON.stringify(deploymentResult, null, 2));
    
    return deploymentResult;
  } catch (error) {
    console.error('Deployment test failed:');
    console.error(error);
    return { success: false, error: error.message };
  }
}

// Run test if script is executed directly
if (require.main === module) {
  testDeployment()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { testDeployment }; 