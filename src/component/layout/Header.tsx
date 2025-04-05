"use client";

import { WalletButton } from "../web3/wallet-options";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useEffect, useState } from "react";

// Define a type for the iOS navigator extension
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function Header() {
  const [isPwa, setIsPwa] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (PWA)
    const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as NavigatorWithStandalone).standalone === true;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || isIOSStandalone;
    setIsPwa(isStandaloneMode);

    // Handle scroll for header styling
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-30 
    transition-all duration-300
    ${isPwa ? 'standalone-header' : ''} 
    ${isScrolled ? 'shadow-sm backdrop-blur-md bg-white/90 dark:bg-background-dark/90' : 'bg-white dark:bg-background-dark'}
    border-t border-border-light dark:border-border-dark
  `;

  return (
    <header className={headerClasses}>
      <div className={`container mx-auto ${isPwa ? 'navbar-safe-area' : 'px-3 sm:px-4'}`}>
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
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent"></div>
    </header>
  );
}