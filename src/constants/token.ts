// Payment token interface
export interface PaymentToken {
  network: string;
  token: string;
  address: string;
  id: string;
  name: string;
  symbol: string;
  image: string;
}

// Supported blockchain networks
export const supportedNetworks = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    tokens: ['USDT', 'USDC'],
    isSupported: true
  },
  {
    id: 'polygon',
    name: 'Polygon',
    tokens: ['USDT', 'USDC'],
    isSupported: true
  },
  {
    id: 'binance',
    name: 'BNB Chain',
    tokens: ['USDT', 'USDC'],
    isSupported: true
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    tokens: ['USDT', 'USDC'],
    isSupported: true
  },
  {
    id: 'optimism',
    name: 'Optimism',
    tokens: ['USDT', 'USDC'],
    isSupported: false
  },
  {
    id: 'base',
    name: 'Base',
    tokens: ['USDT', 'USDC'],
    isSupported: false
  }
];

// Stablecoin decimals
export const tokenDecimals = {
  'USDT': 6,
  'USDC': 6,
  'DAI': 18
};

// Default token selection
export const defaultToken: PaymentToken = {
  network: 'ethereum',
  token: 'USDT',
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum USDT address
  id: 'ethereum-usdt',
  name: 'Tether USD',
  symbol: 'USDT',
  image: '/network-icons/ethereum-usdt.png'
};

// Gas price multipliers for different networks
export const gasMultipliers = {
  'ethereum': 1.2, // 20% buffer for gas price fluctuations
  'polygon': 1.1,
  'binance': 1.1,
  'arbitrum': 1.15,
  'optimism': 1.1,
  'base': 1.1
};

// Estimated gas limits for token transfers
export const estimatedGasLimits = {
  'ethereum': {
    'USDT': 65000,
    'USDC': 60000
  },
  'polygon': {
    'USDT': 80000,
    'USDC': 75000
  },
  'binance': {
    'USDT': 70000,
    'USDC': 65000
  },
  'arbitrum': {
    'USDT': 500000, // Arbitrum uses higher gas limits but costs less in ETH
    'USDC': 450000
  },
  'optimism': {
    'USDT': 200000,
    'USDC': 180000
  },
  'base': {
    'USDT': 120000,
    'USDC': 110000
  }
}; 