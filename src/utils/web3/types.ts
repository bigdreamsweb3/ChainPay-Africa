import { Chain } from "viem";
import { PaymentToken } from "./config";

// Extend the viem Chain type with our custom properties
export interface ChainPayChain extends Chain {
  buyAiritimeContract?: `0x${string}`;
  payAcceptedTokens?: Record<string, PaymentToken>;
  icon?: string;
}

// Legacy interface for deployment details (for backward compatibility)
export interface DeployedContract {
  address: `0x${string}`;
  chainId: number;
  network: string;
  deploymentDate: string;
  deploymentTx: string;
  tokens: {
    [symbol: string]: `0x${string}`;
  };
}

// New contract deployment structure - matches evm-contracts/deployments
export interface ContractDeployment {
  address: `0x${string}`;
  deployedAt: string;
  version: string;
  tokenAddresses: {
    [tokenSymbol: string]: `0x${string}`;
  };
} 