"use client";

import { Header } from "./Header";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NetworkSwitchNotification from "../web3/network-switch-notification";
import { Blocks, Shield, Heart } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletModalProvider } from "@/context/WalletModalContext";
import { WalletOptionsModal } from "@/component/web3/wallet-options-modal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <WalletModalProvider>
        <div className="min-h-screen flex flex-col relative bg-background-light dark:bg-background-dark overflow-x-hidden w-full scroll-smooth">
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              {/* Modal Portal Container - Must be first */}
              <div
                id="modal-root"
                className="fixed inset-0 z-[100] pointer-events-none"
              />

              <WalletOptionsModal />

              {/* Header (assumed to be fixed as per the UI) */}
              <Header />

              {/* Network Switch Notification */}
              <NetworkSwitchNotification className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24" />

              {/* Main Content */}
              <main className="flex-grow relative z-0 overflow-visible py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
                <div className="mx-auto w-full max-w-lg sm:max-w-md lg:max-w-md px-0 sm:px-0">
                  {/* Tagline for branding and trust */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-semibold text-text-primary dark:text-text-light">
                      Pay Bills with Crypto
                    </h1>
                    <p className="text-sm sm:text-base text-text-secondary dark:text-text-dark-secondary mt-2">
                      Fast, secure, and seamless crypto payments.
                    </p>
                  </div>
                  {/* Main content (e.g., bill payment form) */}
                  <div className="">{children}</div>
                </div>
              </main>

              {/* Footer */}
              <footer className="w-full py-4 sm:py-6 lg:py-8 mt-auto z-0 bg-white dark:bg-background-dark sticky bottom-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                    <div className="text-text-secondary dark:text-text-dark-secondary text-xs sm:text-sm flex items-center">
                      <Blocks size={14} className="mr-2 text-brand-primary" />©{" "}
                      {new Date().getFullYear()} ChainPay Africa
                    </div>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      {[
                        { name: "Privacy", icon: Shield },
                        { name: "Terms", icon: Blocks },
                        { name: "Support", icon: Heart },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href="#"
                            className="text-text-secondary dark:text-text-dark-secondary hover:text-brand-primary transition-colors text-xs sm:text-sm flex items-center"
                          >
                            <Icon size={14} className="mr-1.5" />
                            {item.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </footer>
            </QueryClientProvider>
          </WagmiProvider>
        </div>
      </WalletModalProvider>
    </ThemeProvider>
  );
}
