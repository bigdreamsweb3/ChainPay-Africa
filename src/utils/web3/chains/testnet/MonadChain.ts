import { defineChain } from "viem";
import { PaymentToken } from "../../config";
import { getContractAddress, getTokenAddresses } from "../../contracts";

// Define base chain without contract addresses
const baseMonadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MONAD",
    symbol: "MONAD",
  },
  icon: "https://monad.xyz/assets/logo.svg",
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com/" },
  },
});

// Get contract addresses from deployments
const contractAddress = getContractAddress(10143);
const tokenAddresses = getTokenAddresses(10143);

// Add contract addresses to chain definition
export const monadTestnet = {
  ...baseMonadTestnet,
  buyAiritimeContract: "0x882eF9C88BDE52137C746E6e22C23A884098E6e1",
  payAcceptedTokens: {
    USDC: {
      id: tokenAddresses["USDC"] || "0x37D48b63a8D0CB130e2BA5fAc31d9ABF0533c423",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      contractAddress: tokenAddresses["USDC"] || "0x37D48b63a8D0CB130e2BA5fAc31d9ABF0533c423",
      image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      network: "Monad Testnet",
      token: "USDC",
      address: tokenAddresses["USDC"] || "0x37D48b63a8D0CB130e2BA5fAc31d9ABF0533c423",
    },
    USDT: {
      id: tokenAddresses["USDT"] || "0xf8e9ab6f24b84ce036b434b5429f82ca01cf0386",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      contractAddress: tokenAddresses["USDT"] || "0xf8e9ab6f24b84ce036b434b5429f82ca01cf0386",
      image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      network: "Monad Testnet",
      token: "USDT",
      address: tokenAddresses["USDT"] || "0xf8e9ab6f24b84ce036b434b5429f82ca01cf0386",
    },
  } as Record<string, PaymentToken>,
};
