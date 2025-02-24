/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

import { crossfiTestnetParams } from "./src/utils/web3/chains/crossfiChain";

module.exports = {
    solidity: "0.8.28",
    networks: {
        crossfiTestnet: crossfiTestnetParams([
            process.env.ACCOUNT_1,
            process.env.ACCOUNT_2,
        ]),
        // Uncomment and configure if you want to use a different method
        // crossfi: {
        //     url: "https://rpc-testnet.crossfi.network",
        //     chainId: 1970, // CrossFi Testnet Chain ID
        //     accounts: [process.env.PRIVATE_KEY] // Add your wallet's private key
        // }
    },
};