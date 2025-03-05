const { url } = require("inspector");

const crossfiTestnetParams = (accounts) => ({
    // url: "https://rpc.testnet.ms/",
    url: "https://rpc.testnet.ms",
    chainId: 4157, // CrossFi Testnet Chain ID
    accounts: accounts || [],
    // gasPrice: 10000000000,
    gas: "auto",  // Let Hardhat determine the gas settings
    gasPrice: "auto",
});

module.exports = {
    crossfiTestnetParams,
};