"use client";

import { useAccount } from "wagmi";
import { Account } from "./account";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  setIsModalOpen: (open: boolean) => void;
}

export function WalletButton({ setIsModalOpen }: WalletButtonProps) {
  const { isConnected } = useAccount();

  return (
    <div className="relative z-50">
      {isConnected ? (
        <Account />
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white hover:opacity-90 active:scale-95 transition-all duration-200"
          aria-label="Connect wallet"
        >
          <Wallet className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
