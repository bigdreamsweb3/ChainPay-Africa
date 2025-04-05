/** @type import('hardhat/config').HardhatUserConfig */
// import { crossfiTestnetParams } from "./evm-contracts/chains/crossfiChain.js";
import { baseSepoliaParams } from "./evm-contracts/chains/testnet/baseChain.js";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

import { monadTestnetParams } from "./evm-contracts/chains/testnet/monadChain.js";

// Import mainnet configurations if they exist
let baseMainnetParams, monadMainnetParams;
try {
  baseMainnetParams =
    require("./evm-contracts/chains/mainnet/baseChain.js").baseMainnetParams;
} catch (error) {
  console.warn("Base Mainnet configuration not found, skipping...");
}

try {
  monadMainnetParams =
    require("./evm-contracts/chains/mainnet/monadChain.js").monadMainnetParams;
} catch (error) {
  console.warn("Monad Mainnet configuration not found, skipping...");
}

dotenv.config();

export default {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

  paths: {
    sources: "./evm-contracts/contracts",
    tests: "./evm-contracts/test",
    cache: "./evm-contracts/cache",
    artifacts: "./evm-contracts/artifacts",
  },
  networks: {
    // crossfi: {
    //     url: "https://rpc.testnet.ms/",
    //     chainId: 4157,
    //     accounts: [process.env.ACCOUNT_1, process.env.ACCOUNT_2],
    // },

    // crossfiTestnet: crossfiTestnetParams([process.env.NEXT_PUBLIC_ACCOUNT_1]),
    baseSepolia: baseSepoliaParams([process.env.NEXT_PUBLIC_ACCOUNT_1]),
    monadTestnet: monadTestnetParams([process.env.NEXT_PUBLIC_ACCOUNT_1]),

    // Mainnets (only add if configurations exist)
    ...(baseMainnetParams
      ? { baseMainnet: baseMainnetParams([process.env.NEXT_PUBLIC_ACCOUNT_1]) }
      : {}),
    ...(monadMainnetParams
      ? {
          monadMainnet: monadMainnetParams([process.env.NEXT_PUBLIC_ACCOUNT_1]),
        }
      : {}),
  },

  // Custom Etherscan configuration
  etherscan: {
    apiKey: {
      // Base networks
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",

      // Monad networks - replace with actual API key when available
      monadTestnet:
        process.env.MONADSCAN_API_KEY || "NO_API_KEY_REQUIRED_FOR_TESTNET",
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: 10143,
        urls: {
          apiURL: "https://explorer.monad-testnet.com/api",
          browserURL: "https://explorer.monad-testnet.com",
        },
      },
    ],
  },

  // Configure the Sourcify plugin
  sourcify: {
    enabled: false,
  },

  mocha: {
    timeout: 200000, // Increase timeout if needed
  },
};
