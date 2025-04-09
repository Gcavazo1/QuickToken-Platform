// QuickToken Kit - Proprietary License
// Copyright (c) 2023 GigaCode (Gabriel Cavazos). All rights reserved.
// This code is licensed under a proprietary license. See LICENSE file for details.

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // 1. Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 2. Define constructor arguments
  // TODO: Move these to a config file or .env for different networks
  const tokenName = "QuickToken";
  const tokenSymbol = "QKT";
  const maxSupply = ethers.parseUnits("1000000", 18); // 1 Million tokens with 18 decimals
  const mintFee = ethers.parseEther("0.01"); // 0.01 ETH mint fee per token
  const lockDuration = 60 * 60 * 24 * 7; // 7 days lock duration in seconds

  console.log(`Deploying ${tokenName} (${tokenSymbol}) with args:`);
  console.log(`  Deployer/Owner: ${deployer.address}`);
  console.log(`  Max Supply: ${ethers.formatUnits(maxSupply, 18)}`);
  console.log(`  Mint Fee: ${ethers.formatEther(mintFee)} ETH per token`);
  console.log(`  Lock Duration: ${lockDuration} seconds`);

  // 3. Get the Contract Factory
  const QuickToken = await ethers.getContractFactory("QuickToken");

  // 4. Deploy the contract
  const quickToken = await QuickToken.deploy(
    tokenName,
    tokenSymbol,
    maxSupply,
    mintFee,
    lockDuration
  );

  // 5. Wait for deployment to finish
  await quickToken.waitForDeployment();

  // 6. Log the deployed contract address
  console.log("\nQuickToken deployed to:", await quickToken.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 