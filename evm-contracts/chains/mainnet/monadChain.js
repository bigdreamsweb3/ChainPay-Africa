/**
 * Monad Mainnet Configuration
 * Note: These are placeholder values - replace with actual mainnet RPC when network launches
 */
const monadMainnetParams = (accounts) => ({
  url: "https://rpc.monad.xyz",  // Replace with actual mainnet RPC when available
  chainId: 1, // Replace with actual chainId when mainnet launches
  accounts: accounts,
  timeout: 120000,
  gas: 3000000,
  gasPrice: "auto",
});

module.exports = { monadMainnetParams }; 