/**
 * Base Mainnet Configuration
 */
const baseMainnetParams = (accounts) => ({
  url: "https://mainnet.base.org",
  chainId: 8453,
  accounts: accounts,
  timeout: 120000,
  gas: 3000000,
  gasPrice: "auto", 
});

module.exports = { baseMainnetParams }; 