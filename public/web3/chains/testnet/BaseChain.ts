import { defineChain } from "viem";
import { PaymentToken } from "../../config";
import { getTokenAddresses } from "../../contracts";

// Define base chain without contract addresses
const baseBaseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  icon: "https://logosarchive.com/wp-content/uploads/2021/12/Coinbase-icon-symbol-1.svg",
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
  },
});

// Get contract addresses from deployments
// const contractAddress = getContractAddress(84532);
const tokenAddresses = getTokenAddresses(84532);

// Add contract addresses to chain definition
export const baseSepolia = {
  ...baseBaseSepolia,
  buyAiritimeContract: "0x444f84a55104725d0201BbFC5d279aFcF861E374",
  payAcceptedTokens: {
    USDC: {
      id:
        tokenAddresses["USDC"] || "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      contractAddress:
        tokenAddresses["USDC"] || "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
      image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      network: "Base Sepolia",
      token: "USDC",
      address:
        tokenAddresses["USDC"] || "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
    },
    USDT: {
      id:
        tokenAddresses["USDT"] || "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      contractAddress:
        tokenAddresses["USDT"] || "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
      image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      network: "Base Sepolia",
      token: "USDT",
      address:
        tokenAddresses["USDT"] || "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
    },
  } as Record<string, PaymentToken>,
};
