require("@nomicfoundation/hardhat-toolbox");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config/.env') });

// Get environment variables
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

// Log loaded configuration
console.log('Config loaded:');
console.log(`- Infura API Key: ${INFURA_API_KEY ? (INFURA_API_KEY.substring(0, 6) + '...') : 'Not set'}`);
console.log(`- Private Key: ${PRIVATE_KEY ? 'Set (hidden)' : 'Not set'}`);
console.log(`- Etherscan API Key: ${ETHERSCAN_API_KEY ? (ETHERSCAN_API_KEY.substring(0, 6) + '...') : 'Not set'}`);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337,
      // Optional: Set gas price to 0 for local development
      initialBaseFeePerGas: 0
    },
    // Ethereum Mainnet
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 1
    },
    // Ethereum Sepolia Testnet
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 11155111,
      // Recommended gas settings for Sepolia
      gasPrice: 3000000000 // 3 gwei
    },
    // Optimism Mainnet
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 10
    },
    // Polygon Mainnet
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 137
    },
    // Arbitrum Mainnet
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 42161
    },
    // Base Mainnet
    base: {
      url: `https://base-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      chainId: 8453
    }
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      optimisticEthereum: ETHERSCAN_API_KEY,
      arbitrumOne: ETHERSCAN_API_KEY,
      base: ETHERSCAN_API_KEY
    }
  },
  // Add path to artifacts so the web app can find them
  paths: {
    artifacts: './artifacts',
    // Copy artifacts to the web app
    artifactsDir: path.join(__dirname, 'quicktoken-kit-web/src/contracts'),
  },
  // Add ethers v6 compatibility settings
  mocha: {
    timeout: 100000 // longer timeout for test runs
  }
}; 