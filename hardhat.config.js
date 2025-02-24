/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const {
    crossfiTestnetParams,
} = require("./src/utils/web3/chains/crossfiChain.js");

module.exports = {
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

        crossfiTestnet: crossfiTestnetParams([process.env.NEXT_PUBLIC_ACCOUNT_1]),
    },
};