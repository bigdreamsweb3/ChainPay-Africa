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
    <header className="py-3 sticky top-0 z-50 bg-gradient-to-r from-transparent via-chainpay-blue/5 to-transparent backdrop-blur-sm shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#60A5FA]/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5"></div>
      <div className="absolute bottom-0 left-1/3 right-1/3 h-[1px] bg-chainpay-orange/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <ChainPayLogo className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <div
                className={cn(
                  "flex items-center",
                  isHome
                    ? "cursor-default"
                    : "cursor-pointer hover:opacity-80 transition-opacity"
                )}
              >
                <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-brand-primary to-chainpay-blue-light bg-clip-text text-transparent break-words">
                  {appConfig.appNameWord1}
                  <span className="text-lg sm:text-xl font-semibold text-chainpay-orange">
                    {appConfig.appNameWord2}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Country Selector and Wallet Button */}
          <div className="flex items-center gap-3">
            {/* Wallet Button */}
            <div className="flex-shrink-0">
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
