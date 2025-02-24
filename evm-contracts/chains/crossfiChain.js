const crossfiTestnetParams = (accounts) => ({
    url: "https://rpc.testnet.ms/",
    chainId: 4157, // CrossFi Testnet Chain ID
    accounts: accounts || [],
    gasPrice: 10000000000,
});

module.exports = {
    crossfiTestnetParams,
};