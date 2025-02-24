"use client"; // Add this at the top

import { Header } from "./Header";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NetworkSwitchNotification from "../web3/network-switch-notification";
import { appConfig } from "@/app-config";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Initialize QueryClient using useState (Best Practice)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {/* Header */}
          <Header />

          {/* Network Switch Notification */}
          <NetworkSwitchNotification className="container mx-auto px-4 sm:px-6 lg:px-8" />

          {/* Main Content */}
          <main className="container mx-auto w-full max-w-md px-4 py-6 sm:px-6 lg:px-8 lg:py-12 flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-white">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-sm text-gray-600 text-center">
                © {new Date().getFullYear()} {appConfig.appFullName}. All rights
                reserved.
              </p>
            </div>
          </footer>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
