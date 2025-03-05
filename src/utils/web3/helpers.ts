export function shortenAddress(address: string): string {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export function formatChainId(chainId: number): string {
  switch (chainId) {
    case 56:
      return 'BSC Mainnet'
    case 97:
      return 'BSC Testnet'
    default:
      return 'Unknown Network'
  }
} 
// 