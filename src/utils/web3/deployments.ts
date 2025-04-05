// This file is deprecated - now using evm-contracts/deployments/index.js
// Import from src/utils/web3/contracts.ts instead

import { getContractAddress, getTokenAddresses } from './contracts';

export { getContractAddress, getTokenAddresses };

// For backward compatibility
export default {
  getContractAddress,
  getTokenAddresses
}; 