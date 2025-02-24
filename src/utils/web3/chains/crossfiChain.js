const { defineChain } = require("viem");

const crossfiTestnetParams = (accounts) => ({
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
    url: "https://rpc.testnet.ms/",
    chainId: 4157, // CrossFi Testnet Chain ID
    accounts: accounts || [],
});

const crossfiTestnetDefineChain = defineChain(crossfiTestnetParams());

const crossfi_testnet = crossfiTestnetDefineChain;

module.exports = {
    crossfiTestnetParams,
    crossfiTestnetDefineChain,
    crossfi_testnet,
};