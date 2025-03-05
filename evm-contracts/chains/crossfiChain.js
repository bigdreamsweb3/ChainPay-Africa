const { url } = require("inspector");

const crossfiTestnetParams = (accounts) => ({
    url: "https://rpc.testnet.ms",  // Updated RPC URL
    chainId: 4157,
    accounts: accounts || [],
    timeout: 120000,  // Increased timeout
    gas: 3000000,
    gasPrice: "auto",
    // Optional network-specific settings
    networkCheckTimeout: 100000,
    timeoutBlocks: 200,
    // Confirmation blocks
    confirmations: 2,
    // Optional verification settings
    verify: {
        etherscan: {
            apiUrl: 'https://test.xfiscan.com/'
        }
    }
});

module.exports = {
    crossfiTestnetParams,
};