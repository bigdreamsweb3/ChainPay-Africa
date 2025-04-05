import { baseSepolia } from "./testnet/BaseChain";
import { monadTestnet } from "./testnet/MonadChain";
import { ChainPayChain } from "../types";

export const acceptedChains = [baseSepolia, monadTestnet] as ChainPayChain[];

export { baseSepolia, monadTestnet };
