"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { Account } from "@/component/web3/account";
import { WalletOptions } from "@/component/web3/wallet-options";

function ConnectWallet() {
  const { isConnected } = useAccount();
  return isConnected ? <Account /> : <WalletOptions />;
}

export function Header() {
  return (
    <header className="py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="ChainPay"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              priority
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Chain<span className="text-brand-secondary">Pay</span>
            </span>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
