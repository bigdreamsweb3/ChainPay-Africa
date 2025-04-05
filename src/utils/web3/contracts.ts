import { Chain } from 'viem';

// Import from the types file to avoid duplicate definitions
import { ContractDeployment as IContractDeployment } from './types';

// Import deployments - use dynamic import with webpack
const contractDeployments = {
  // Default empty implementation in case the import fails
  deployments: {},
  getContractAddress: () => '0x0000000000000000000000000000000000000000',
  getTokenAddresses: () => ({})
};

// Try to load the actual deployments
try {
  // This is wrapped in try/catch to handle server/client side rendering differences
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const deploymentModule = require('../../../evm-contracts/deployments/index');
  Object.assign(contractDeployments, deploymentModule);
} catch (error) {
  console.warn('Failed to load contract deployments:', error);
}

export interface ChainDeployments {
  [contractName: string]: IContractDeployment;
}

export interface AllDeployments {
  [chainId: string]: ChainDeployments;
}

// Type-cast the deployments to our TypeScript interface
export const deployments = contractDeployments.deployments as AllDeployments;

// Type-cast the methods to have the correct signature types
const getContractAddressImpl = contractDeployments.getContractAddress as (
  chainId: number | string,
  contractName?: string
) => string | null;

const getTokenAddressesImpl = contractDeployments.getTokenAddresses as (
  chainId: number | string,
  contractName?: string
) => Record<string, string>;

/**
 * Get the address of a deployed contract
 * @param chainId - The chain ID
 * @param contractName - The name of the contract (defaults to ChainPay_Airtime)
 * @returns The contract address as a 0x-prefixed string or a zero address if not found
 */
export function getContractAddress(
  chainId: number | string,
  contractName = 'ChainPay_Airtime'
): `0x${string}` {
  const address = getContractAddressImpl(chainId, contractName);
  return address as `0x${string}` || '0x0000000000000000000000000000000000000000';
}

/**
 * Get the token addresses for a deployed contract
 * @param chainId - The chain ID
 * @param contractName - The name of the contract (defaults to ChainPay_Airtime)
 * @returns The token addresses as an object with token symbols as keys
 */
export function getTokenAddresses(
  chainId: number | string,
  contractName = 'ChainPay_Airtime'
): { [tokenSymbol: string]: `0x${string}` } {
  return getTokenAddressesImpl(chainId, contractName) as {
    [tokenSymbol: string]: `0x${string}`;
  };
}

/**
 * Updates the contract configuration in Viem chain definitions
 * @param chain - The chain to update
 * @param contractName - The contract name to get the address for
 * @returns The updated chain with contract addresses
 */
export function updateChainWithContracts<T extends Chain>(
  chain: T & { id: number },
  contractName = 'ChainPay_Airtime'
): T & { buyAiritimeContract: `0x${string}` } {
  const contractAddress = getContractAddress(chain.id, contractName);
  return {
    ...chain,
    buyAiritimeContract: contractAddress,
  } as T & { buyAiritimeContract: `0x${string}` };
} 