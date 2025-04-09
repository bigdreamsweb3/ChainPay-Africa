"use client";

import { WalletButton } from "../web3/wallet-options";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50); // Change 30 to your desired scroll threshold
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 border-t border-border-light dark:border-border-dark ${isScrolled ? 'bg-white dark:bg-background-dark' : 'bg-background-light dark:bg-background-dark'} transition-all duration-300`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Left Section: Brand Name */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-lg font-heading font-bold bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark dark:from-chainpay-blue-light dark:to-chainpay-blue bg-clip-text text-transparent">
                Chain
              </span>
              <span className="text-lg font-heading font-bold text-chainpay-gold dark:text-chainpay-gold/90">
                Pay
              </span>
            </div>
          </div>

          {/* Right Section: Theme Toggle and Wallet Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex-shrink-0">
              <WalletButton />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      {isScrolled && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent"></div>}
    </header>
  );
}