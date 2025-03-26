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
      <div className="min-h-screen flex flex-col relative bg-white overflow-x-hidden w-full">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Header />

            <NetworkSwitchNotification className="container mx-auto px-4 sm:px-6" />

            <main className="flex-grow relative z-0 overflow-visible py-5 px-2 sm:py-8">
              <div className="container mx-auto w-full max-w-md px-4 sm:px-6">
                {children}
              </div>
            </main>

            <footer className="w-full py-6 sm:py-8 mt-auto border-t border-gray-200 relative z-0">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                  <div className="text-gray-600 text-sm flex items-center">
                    <Blocks size={14} className="mr-1.5 text-chainpay-orange" />
                    © {new Date().getFullYear()} ChainPay Africa
                  </div>
                  <div className="flex items-center space-x-5 sm:space-x-8">
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
                          className="text-gray-600 hover:text-chainpay-orange transition-colors text-xs sm:text-sm flex items-center"
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

      {/* Modal Portal Container */}
      <div
        id="modal-root"
        className="fixed inset-0 z-[100] pointer-events-none"
      />
    </>
  );
}
