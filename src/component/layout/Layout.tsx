"use client"; // Add this at the top

import { Header } from "./Header";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NetworkSwitchNotification from "../web3/network-switch-notification";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Initialize QueryClient using useState (Best Practice)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-white to-blue-50/30 -z-10" />
      
      {/* Tech background elements */}
      <div className="fixed inset-0 opacity-3 -z-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwNjZDQyIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>
      </div>

      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {/* Header */}
          <Header />

          {/* Network Switch Notification */}
          <NetworkSwitchNotification className="container mx-auto px-4 mt-2" />

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.main
              className="container mx-auto w-full max-w-md px-4 py-8 flex-grow relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.main>
          </AnimatePresence>

          {/* Footer */}
          <footer className="w-full py-4 relative mt-auto">
            {/* Transparent with very subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chainpay-blue/5 to-transparent"></div>
            
            {/* Minimal top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10"></div>
            <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-chainpay-orange/20"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="text-chainpay-blue-dark text-sm mb-2 sm:mb-0 flex items-center">
                  <Blocks size={14} className="mr-1 text-chainpay-orange" />
                  © {new Date().getFullYear()} ChainPay Africa
                </div>
                
                <div className="flex space-x-6">
                  {["Privacy", "Terms", "Support"].map((item, index) => (
                    <motion.a 
                      key={item}
                      href="#" 
                      className="text-chainpay-blue-dark hover:text-chainpay-orange transition-colors text-sm flex items-center"
                      whileHover={{ y: -1 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
