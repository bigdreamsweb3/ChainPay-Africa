const monadTestnetParams = (accounts) => ({
  url: "https://testnet-rpc.monad.xyz/",
  chainId: 10143,
  accounts: accounts,
  timeout: 120000,
  gas: 3000000,
  gasPrice: "auto",
});

module.exports = { monadTestnetParams };
