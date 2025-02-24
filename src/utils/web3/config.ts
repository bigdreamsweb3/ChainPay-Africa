import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
import { crossfiTestnet } from "./chains/crossfiChain";
import { monadTestnet } from "./chains/monadChain";

export const SUPPORTED_CHAIN_IDS = [mainnet, crossfiTestnet, monadTestnet];

export const DEFAULT_CHAIN = crossfiTestnet;

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export const wagmiConfig = createConfig({
  chains: [mainnet, crossfiTestnet, monadTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [crossfiTestnet.id]: http(),
    [monadTestnet.id]: http(),
  },
});

// // Example usage in a React component
// const BalanceComponent = () => {
//   const { fetchBalance } = useBalance();

//   const balance = fetchBalance();
//   console.log("Balance:", balance);

//   return balance;
// };

// export default BalanceComponent;
