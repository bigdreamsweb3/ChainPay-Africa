"use client";

import { Header } from "./Header";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NetworkSwitchNotification from "../web3/network-switch-notification";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletModalProvider } from "@/context/WalletModalContext";
import { WalletOptionsModal } from "@/component/web3/wallet-options-modal";
import ChainPayInfoCard from "../chainpay-info-card";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <WalletModalProvider>
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-x-hidden w-full">
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <div
                id="modal-root"
                className="fixed inset-0 z-[100] pointer-events-none"
              />
              <WalletOptionsModal />
              <Header />
              <NetworkSwitchNotification className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20" />
              <main className="flex-1 flex flex-col min-h-screen relative z-0 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="mx-auto w-full max-w-lg sm:max-w-md lg:max-w-md px-0 sm:px-0 flex-1 flex flex-col">
                  <div className="mb-6">
                    <ChainPayInfoCard />
                  </div>
                  <div className="flex-1">{children}</div>
                </div>
              </main>
             
            </QueryClientProvider>
          </WagmiProvider>
        </div>
      </WalletModalProvider>
    </ThemeProvider>
  );
}
