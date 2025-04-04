import { baseSepolia } from "./BaseChain";
import { monadTestnet } from "./MonadChain";
import { ChainPayChain } from "../types";

export const acceptedChains = [baseSepolia, monadTestnet] as ChainPayChain[];

export { baseSepolia, monadTestnet };
// export default baseSepolia;

// export const crossfiTestnet = defineChain({
//   id: 4157,
//   name: "CrossFi Testnet",
//   nativeCurrency: {
//     decimals: 18,
//     name: "XFI",
//     symbol: "XFI",
//   },
//   icon: "https://crossfi.org/wp-content/uploads/2024/12/xfi-icon.svg",
//   rpcUrls: {
//     default: {
//       http: ["https://rpc.testnet.ms/"],
//     },
//   },
//   blockExplorers: {
//     default: { name: "Explorer", url: "https://test.xfiscan.com/" },
//   },

//   payAcceptedTokens: {
//     // XFI: {
//     //   id: "0x0000000000000000000000000000000000000000",
//     //   name: "XFI",
//     //   symbol: "XFI",
//     //   decimals: 18,
//     //   contractAddress: "",
//     //   image: "https://crossfi.org/wp-content/uploads/2024/12/xfi.svg",
//     // },

//     // pNGN: {
//     //   id: "0x0000000000000000000000000000000000000001",
//     //   name: "pNGN",
//     //   symbol: "pNGN",
//     //   decimals: 18,
//     //   contractAddress: "0xea26a662333a2a5E87fB6851fc24a47fa53d98D1",
//     //   image: "https://example.com/pNGN.png",
//     // },

//     XUSD: {
//       id: "0x0000000000000000000000000000000000000002",
//       name: "XUSD",
//       symbol: "XUSD",
//       decimals: 18,
//       contractAddress: "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff",
//       image: "https://crossfi.org/wp-content/uploads/2024/12/xusd-2.svg",
//       icon: "https://crossfi.org/wp-content/uploads/2024/12/xusd-icon.svg",
//       network: "CrossFi Testnet",
//       token: "XUSD",
//       address: "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff",
//     },

//     // xUSDT: {
//     //   id: "0x0000000000000000000000000000000000000003",
//     //   name: "XUSDT",
//     //   symbol: "XUSDT",
//     //   decimals: 18,
//     //   contractAddress: "0x0000000000000000000000000000000000000000",
//     //   image: "https://example.com/USDT.png",
//     // },

//     // xUSDC: {
//     //   id: "0x0000000000000000000000000000000000000004",
//     //   name: "XUSDC",
//     //   symbol: "XUSDC",
//     //   decimals: 18,
//     //   contractAddress: "0x0000000000000000000000000000000000000000",
//     //   image: "https://example.com/USDC.png",
//     // },
//   } as Record<string, PaymentToken>,
// });

// export const baseSepolia = defineChain({
//   id: 84532,
//   name: "Base Sepolia",
//   nativeCurrency: {
//     decimals: 18,
//     name: "ETH",
//     symbol: "ETH",
//   },
//   icon: "https://logosarchive.com/wp-content/uploads/2021/12/Coinbase-icon-symbol-1.svg",
//   rpcUrls: {
//     default: {
//       http: ["https://sepolia.base.org"],
//     },
//   },
//   blockExplorers: {
//     default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
//   },
//   payAcceptedTokens: {
//     USDC: {
//       id: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
//       name: "USD Coin",
//       symbol: "USDC",
//       decimals: 6,
//       contractAddress: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
//       image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
//       icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
//       network: "Base Sepolia",
//       token: "USDC",
//       address: "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897",
//     },
//     USDT: {
//       id: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
//       name: "Tether USD",
//       symbol: "USDT",
//       decimals: 6,
//       contractAddress: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
//       image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
//       icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
//       network: "Base Sepolia",
//       token: "USDT",
//       address: "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7",
//     },
//   } as Record<string, PaymentToken>,
// });
