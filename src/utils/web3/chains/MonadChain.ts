import { defineChain } from "viem";
import { PaymentToken } from "../config";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  icon: "/icons/monad.webp",
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "http://testnet.monadexplorer.com/" },
  },
  payAcceptedTokens: {
    USDC: {
      id: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      contractAddress: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
      image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      network: "Monad Testnet",
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
      network: "Monad Testnet",
      token: "USDT",
      address: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
    },
  } as Record<string, PaymentToken>,
});
