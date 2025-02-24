import { defineChain } from "viem";
import { PaymentToken } from "../config";

export const crossfiTestnet = defineChain({
  id: 4157,
  name: "CrossFi Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-t.crossfi.nodestake.org"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://test.xfiscan.com/" },
  },

  payAcceptedTokens: {
    xFI: {
      id: "0x0000000000000000000000000000000000000000",
      name: "xFI",
      symbol: "xFI",
      decimals: 18,
      contractAddress: "0x0000000000000000000000000000000000000000",
      image: "https://example.com/xFI.png",
    },

    pNGN: {
      id: "0x0000000000000000000000000000000000000001",
      name: "pNGN",
      symbol: "pNGN",
      decimals: 18,
      contractAddress: "0x0000000000000000000000000000000000000000",
      image: "https://example.com/pNGN.png",
    },

    xUSD: {
      id: "0x0000000000000000000000000000000000000002",
      name: "xUSD",
      symbol: "xUSD",
      decimals: 18,
      contractAddress: "0x0000000000000000000000000000000000000000",
      image: "https://crossfi.org/wp-content/uploads/2024/12/xusd-2.svg",
    },

    xUSDT: {
      id: "0x0000000000000000000000000000000000000003",
      name: "xUSDT",
      symbol: "xUSDT",
      decimals: 18,
      contractAddress: "0x0000000000000000000000000000000000000000",
      image: "https://example.com/USDT.png",
    },

    xUSDC: {
      id: "0x0000000000000000000000000000000000000004",
      name: "xUSDC",
      symbol: "xUSDC",
      decimals: 18,
      contractAddress: "0x0000000000000000000000000000000000000000",
      image: "https://example.com/USDC.png",
    },
  } as Record<string, PaymentToken>,
});
