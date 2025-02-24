import { defineChain } from "viem";

export const crossfiTestnetParams = (accounts?: string[]) =>
  defineChain({
    id: 4157,
    name: "CrossFi Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "XFI",
      symbol: "XFI",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.testnet.ms/"],
      },
    },
    blockExplorers: {
      default: { name: "Explorer", url: "https://test.xfiscan.com/" },
    },
    accounts: accounts || [],
  });

export const crossfi_testnet = crossfiTestnetParams();

// const client = createPublicClient({
//   chain: crossfiTestnet,
//   transport: http(),
// });

// const blockNumber = await client.getBlockNumber();

// console.log(blockNumber);

// export default `Block number: ${blockNumber}`;
