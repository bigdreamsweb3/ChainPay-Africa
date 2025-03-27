"use client";

import { Header } from "./Header";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NetworkSwitchNotification from "../web3/network-switch-notification";
import { Blocks, Shield, Heart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <div className="min-h-screen flex flex-col relative bg-chainpay-blue-light/10 overflow-x-hidden w-full">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Header />

            <NetworkSwitchNotification className="container mx-auto px-3 sm:px-4" />

            <main className="flex-grow relative z-0 overflow-visible py-4 sm:py-6 px-2">
              <div className="container mx-auto w-full max-w-md px-3 sm:px-4">
                {children}
              </div>
            </main>

            <footer className="w-full py-4 sm:py-6 mt-auto border-t border-chainpay-blue-light/20 relative z-0">
              <div className="container mx-auto px-3 sm:px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                  <div className="text-chainpay-blue-dark/60 text-xs flex items-center">
                    <Blocks size={12} className="mr-1 text-chainpay-orange" />
                    © {new Date().getFullYear()} ChainPay Africa
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
                          className="text-chainpay-blue-dark/60 hover:text-chainpay-orange transition-colors text-xs flex items-center"
                        >
                          <Icon size={12} className="mr-1" />
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

      {/* Modal Portal Container */}
      <div
        id="modal-root"
        className="fixed inset-0 z-[100] pointer-events-none"
      />
    </>
  );
}
