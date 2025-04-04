import { Chain } from "viem";
import { PaymentToken } from "./config";

// Extend the viem Chain type with our custom properties
export interface ChainPayChain extends Chain {
  buyAiritimeContract?: `0x${string}`;
  payAcceptedTokens?: Record<string, PaymentToken>;
  icon?: string;
} 