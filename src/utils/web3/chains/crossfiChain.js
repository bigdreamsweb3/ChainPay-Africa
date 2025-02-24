const crossfiTestnetParams = (accounts) => ({
    name: "CrossFi Testnet",
    url: "https://rpc.testnet.ms/",
    chainId: 4157, // CrossFi Testnet Chain ID
    accounts: accounts || [],
});

module.exports = {
    crossfiTestnetParams,
};