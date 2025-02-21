"use client"; // Add this at the top

import { Header } from "./Header";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NetworkSwitchNotification from "../web3/network-switch-notification";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Initialize QueryClient using useState (Best Practice)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="min-h-screen bg-white relative">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <NetworkSwitchNotification className="container" />

          <main className="container w-full max-w-md mx-auto px-4 py-8 lg:px-8 min-h-screen bg-gray-50">
            {children}
          </main>

          <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-6 lg:px-8">
              <p className="text-sm text-gray-600 text-center">
                © {new Date().getFullYear()} Your App Name. All rights reserved.
              </p>
            </div>
          </footer>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
