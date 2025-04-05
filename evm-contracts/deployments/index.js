/**
 * Contract Deployments Registry
 * This file tracks all contract deployments across different networks
 */

// Structure for deployments
// {
//   [networkId]: {
//     [contractName]: {
//       address: string,
//       deployedAt: string date,
//       version: string,
//       abi: string path to ABI file (optional)
//     }
//   }
// }

const deployments = {
  "10143": {
    "ChainPay_Airtime": {
      "address": "0x882eF9C88BDE52137C746E6e22C23A884098E6e1",
      "deployedAt": "2025-04-05",
      "version": "1.0.0",
      "tokenAddresses": {
        "USDC": "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A",
        "USDT": "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D"
      }
    }
  },
  "84532": {
    "ChainPay_Airtime": {
      "address": "0xEf5A24b6527417EED9a5FAa192b5Cfe4580366F2",
      "deployedAt": "2025-04-05",
      "version": "1.0.0",
      "tokenAddresses": {
        "USDC": "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
        "USDT": "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7"
      }
    }
  }
};

/**
 * Get the address of a deployed contract
 * @param {number|string} chainId - The chain ID
 * @param {string} contractName - The name of the contract
 * @returns {string} The contract address or null if not found
 */
function getContractAddress(chainId, contractName = "ChainPay_Airtime") {
  const chainDeployments = deployments[chainId.toString()];
  if (!chainDeployments) return null;
  
  const contract = chainDeployments[contractName];
  return contract ? contract.address : null;
}

/**
 * Get the token addresses for a deployed contract
 * @param {number|string} chainId - The chain ID
 * @param {string} contractName - The name of the contract
 * @returns {Object} The token addresses or empty object if not found
 */
function getTokenAddresses(chainId, contractName = "ChainPay_Airtime") {
  const chainDeployments = deployments[chainId.toString()];
  if (!chainDeployments) return {};
  
  const contract = chainDeployments[contractName];
  return contract && contract.tokenAddresses ? contract.tokenAddresses : {};
}

/**
 * Update contract deployment information
 * @param {number|string} chainId - The chain ID
 * @param {string} contractName - The name of the contract
 * @param {Object} deploymentInfo - The deployment information
 */
function updateDeployment(chainId, contractName, deploymentInfo) {
  const chainIdStr = chainId.toString();
  
  // Initialize chain entry if it doesn't exist
  if (!deployments[chainIdStr]) {
    deployments[chainIdStr] = {};
  }
  
  // Update or create contract entry
  deployments[chainIdStr][contractName] = {
    ...deployments[chainIdStr][contractName],
    ...deploymentInfo
  };
  
  return deployments[chainIdStr][contractName];
}

module.exports = {
  deployments,
  getContractAddress,
  getTokenAddresses,
  updateDeployment
}; 