import { defineChain, Chain } from 'viem';

// Import deployments from the evm-contracts directory
// We're dynamically requiring the file and then mapping the values to TypeScript types
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contractDeployments = require('../../../evm-contracts/deployments/index');

// Define the deployment structure in TypeScript
export interface ContractDeployment {
  address: `0x${string}`;
  deployedAt: string;
  version: string;
  tokenAddresses: {
    [tokenSymbol: string]: `0x${string}`;
  };
}

export interface ChainDeployments {
  [contractName: string]: ContractDeployment;
}

export interface AllDeployments {
  [chainId: string]: ChainDeployments;
}

// Type-cast the deployments to our TypeScript interface
export const deployments = contractDeployments.deployments as AllDeployments;

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
  const address = contractDeployments.getContractAddress(chainId, contractName);
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
  return contractDeployments.getTokenAddresses(chainId, contractName) as {
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