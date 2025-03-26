"use client";

import { WalletButton } from "../web3/wallet-button";
import { ChainPayLogo } from "../web3/chainpay-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { appConfig } from "@/app-config";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="w-full py-4 sm:py-5 relative z-30">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo - without animations */}
          <div
            className={cn(
              "flex items-center space-x-3",
              isHome
                ? "cursor-default"
                : "cursor-pointer hover:opacity-80 transition-opacity"
            )}
          >
            <ChainPayLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-semibold text-chainpay-blue break-words">
                {appConfig.appNameWord1}
                <span className="text-lg sm:text-xl font-semibold text-chainpay-orange">
                  {appConfig.appNameWord2}
                </span>
              </span>
            </div>
          </div>

          {/* Wallet Button - without animation wrapper */}
          <div>
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
