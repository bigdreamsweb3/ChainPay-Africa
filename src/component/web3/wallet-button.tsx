"use client";

import { useAccount } from "wagmi";
import { Account } from "./account";
import { WalletOptions } from "./wallet-options";
import { motion } from "framer-motion";

export function WalletButton() {
  const { isConnected } = useAccount();

  return (
    <div className="relative z-40">
      {isConnected ? <Account /> : <WalletOptions />}
    </div>
  );
} 