"use client";

import { ChainPayLogo } from "../web3/chainpay-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { appConfig } from "@/app-config";
import { WalletButton } from "../web3/wallet-options"; // This import should now work

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border-light transition-all duration-300">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Left Section: Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ChainPayLogo className="w-8 h-8 drop-shadow-sm" />
            </div>
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center",
                  isHome
                    ? "cursor-default"
                    : "cursor-pointer hover:opacity-90 transition-opacity"
                )}
              >
                <span className="text-base font-semibold bg-gradient-to-r from-chainpay-blue-dark to-chainpay-blue bg-clip-text text-transparent">
                  {appConfig.appNameWord1}
                  <span className="text-chainpay-gold font-semibold">
                    {appConfig.appNameWord2}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Wallet Button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WalletButton />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent"></div>
    </header>
  );
}