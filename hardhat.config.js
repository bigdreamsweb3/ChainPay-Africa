/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const {
    crossfiTestnetParams,
} = require("./src/utils/web3/chains/crossfiChain.js");

module.exports = {
    solidity: "0.8.28",
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

        crossfiTestnet: crossfiTestnetParams([
            "0x0000000000000000000000000000000000000000000000000000000000000000",
        ]),
    },
};