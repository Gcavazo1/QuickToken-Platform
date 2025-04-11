// Script to copy contract artifacts to the web app folder
const fs = require('fs');
const path = require('path');

// Paths
const artifactsDir = path.join(__dirname, '../artifacts/contracts');
const webContractsDir = path.join(__dirname, '../quicktoken-kit-web/src/contracts');

// Ensure target directory exists
if (!fs.existsSync(webContractsDir)) {
  console.log(`Creating web contracts directory: ${webContractsDir}`);
  fs.mkdirSync(webContractsDir, { recursive: true });
}

// Copy the QuickToken contract artifacts
function copyArtifacts() {
  console.log('Copying contract artifacts to web app...');
  
  try {
    // Find the QuickToken.sol directory
    const quickTokenDir = path.join(artifactsDir, 'QuickToken.sol');
    
    if (!fs.existsSync(quickTokenDir)) {
      console.error(`QuickToken artifacts not found at ${quickTokenDir}`);
      console.error('Have you compiled the contract with "npx hardhat compile"?');
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
    const contractArtifact = require(sourceFile);
    
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

// Run if the script is executed directly
if (require.main === module) {
  const success = copyArtifacts();
  process.exit(success ? 0 : 1);
}

module.exports = { copyArtifacts }; 