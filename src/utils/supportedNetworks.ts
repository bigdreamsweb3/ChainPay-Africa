import { supportedNetworks } from '@/constants/token';

/**
 * Check if a blockchain network is supported for payments
 * @param networkId The network ID to check
 * @returns Boolean indicating if the network is supported
 */
export function isNetworkSupported(networkId: string): boolean {
  const network = supportedNetworks.find(net => net.id === networkId);
  return network ? network.isSupported : false;
}

/**
 * Get a list of all supported network IDs
 * @returns Array of supported network IDs
 */
export function getSupportedNetworkIds(): string[] {
  return supportedNetworks
    .filter(network => network.isSupported)
    .map(network => network.id);
}

/**
 * Get a list of all supported tokens for a specific network
 * @param networkId The network ID to check
 * @returns Array of supported token symbols or empty array if network not found
 */
export function getSupportedTokensForNetwork(networkId: string): string[] {
  const network = supportedNetworks.find(net => net.id === networkId);
  return network ? network.tokens : [];
}

/**
 * Check if a specific token is supported on a network
 * @param networkId The network ID
 * @param tokenSymbol The token symbol
 * @returns Boolean indicating if the token is supported on the network
 */
export function isTokenSupportedOnNetwork(networkId: string, tokenSymbol: string): boolean {
  const tokens = getSupportedTokensForNetwork(networkId);
  return tokens.includes(tokenSymbol);
}

/**
 * Get network name from its ID
 * @param networkId The network ID
 * @returns Network name or undefined if not found
 */
export function getNetworkName(networkId: string): string | undefined {
  const network = supportedNetworks.find(net => net.id === networkId);
  return network?.name;
} 