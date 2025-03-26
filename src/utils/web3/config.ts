import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
import { monadTestnet } from "./chains/monadChain";
import { crossfiTestnet } from "./chains";
import { useAccount } from "wagmi";

export const SUPPORTED_CHAIN_IDS = [mainnet, crossfiTestnet, monadTestnet];

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

export interface PaymentToken {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  image: string;
  network: string;
  token: string;
  address: string;
}

// Custom hook to get accepted tokens for the connected chain
export const useAcceptedTokens = (): PaymentToken[] => {
  const { chain } = useAccount();

  if (!chain) return []; // Return empty if no chain is connected

  const acceptedTokens =
    chain.id === crossfiTestnet.id ? crossfiTestnet.payAcceptedTokens : {};

  return Object.values(acceptedTokens) as PaymentToken[]; // Cast to PaymentToken[]
};

// Custom hook to get the available chains
export const useAvailableChains = () => {
  const { chain } = useAccount();
  return chain ? [chain] : []; // Return the connected chain if available
};

