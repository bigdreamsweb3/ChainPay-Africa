import { defineChain } from "viem";
import { PaymentToken } from "../config";

export const baseSepolia = defineChain({
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

  buyAiritimeContract: "0xA124c1f8219068b4783424409518E4Ea014e4DD0",

  payAcceptedTokens: {
    USDC: {
      id: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      contractAddress: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
      image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      network: "Base Sepolia",
      token: "USDC",
      address: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
    },
    USDT: {
      id: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      contractAddress: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
      image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      network: "Base Sepolia",
      token: "USDT",
      address: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
    },
  } as Record<string, PaymentToken>,
});
