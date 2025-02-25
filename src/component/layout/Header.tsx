"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { Account } from "@/component/web3/account";
import { WalletOptions } from "@/component/web3/wallet-options";
import { MapPin } from "lucide-react";
import { appConfig } from "@/app-config";

function ConnectWallet() {
  const { isConnected } = useAccount();
  return isConnected ? <Account /> : <WalletOptions />;
}

export function Header() {
  return (
    <header className="py-2 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <Image
                src={appConfig.appLogo}
                alt="ChainPay"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                priority
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                <div className="bg-green-500 w-1.5 h-1.5 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {appConfig.appName}
                <span className="text-brand-secondary">
                  {appConfig.appSubName}
                </span>
              </span>
              <div className="flex items-center gap-0.5 text-[10px] sm:text-xs text-gray-500">
                <MapPin size={10} />
                <span>{appConfig.appRegion}</span>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
