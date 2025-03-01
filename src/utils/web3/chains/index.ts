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
      http: ["https://rpc.testnet.ms"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://test.xfiscan.com/" },
  },

  payAcceptedTokens: {
    XFI: {
      id: "0x0000000000000000000000000000000000000000",
      name: "XFI",
      symbol: "XFI",
      decimals: 18,
      contractAddress: "0xea26a662333a2a5E87fB6851fc24a47fa53d98D1",
      image: "https://example.com/xFI.png",
    },

    pNGN: {
      id: "0x0000000000000000000000000000000000000001",
      name: "pNGN",
      symbol: "pNGN",
      decimals: 18,
      contractAddress: "0xea26a662333a2a5E87fB6851fc24a47fa53d98D1",
      image: "https://example.com/pNGN.png",
    },

    XUSD: {
      id: "0x0000000000000000000000000000000000000002",
      name: "XUSD",
      symbol: "xUSD",
      decimals: 18,
      contractAddress: "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff",
      image: "https://crossfi.org/wp-content/uploads/2024/12/xusd-2.svg",
    },

    // xUSDT: {
    //   id: "0x0000000000000000000000000000000000000003",
    //   name: "XUSDT",
    //   symbol: "XUSDT",
    //   decimals: 18,
    //   contractAddress: "0x0000000000000000000000000000000000000000",
    //   image: "https://example.com/USDT.png",
    // },

    // xUSDC: {
    //   id: "0x0000000000000000000000000000000000000004",
    //   name: "XUSDC",
    //   symbol: "XUSDC",
    //   decimals: 18,
    //   contractAddress: "0x0000000000000000000000000000000000000000",
    //   image: "https://example.com/USDC.png",
    // },
  } as Record<string, PaymentToken>,
});
