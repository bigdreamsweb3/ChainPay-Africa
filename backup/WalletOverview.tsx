"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
// import { getWalletTokenBalances } from "@/api/GetWalletTokenBalances";

interface WalletBalance {
  BNB: number;
  USDC: number;
}


export default function WalletOverview() {
  const { isConnected } = useAccount();
  const [balances, setBalances] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
    
      // Replace with actual API call
      const response = await new Promise<WalletBalance>((resolve) =>
        setTimeout(() => resolve({ BNB: 1.23, USDC: 100.45 }), 1000)
      );
      setBalances(response);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch balances");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchBalances();
    }
  }, [fetchBalances, isConnected]);

  // Dummy data for when the wallet is not connected
  const totalBalance = isConnected
    ? balances
      ? balances.BNB * 300 + balances.USDC
      : 0
    : 0; // Assuming 1 BNB = $300 USD

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="relative bg-gradient-to-br from-brand-primary to-brand-accent rounded-3xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute transform -rotate-45 translate-y-1/2 -translate-x-1/4 bg-text-light w-96 h-96 rounded-full blur-3xl" />
          <div className="absolute right-0 transform translate-x-1/2 translate-y-1/4 bg-brand-secondary/20 w-96 h-96 rounded-full blur-3xl" />
        </div>

        <div className="relative p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Wallet className="text-text-light h-6 w-6" />
              <span className="text-text-light text-lg font-medium">
                Wallet Overview
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading && isConnected ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-24"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/90"
              >
                <p>{error}</p>
              </motion.div>
            ) : (
              <motion.div
                key="balances"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-white">
                  <p className="text-sm text-white/80">Total Balance</p>
                  {isConnected ? (
                    <AnimatedNumber
                      value={totalBalance}
                      className="text-xl font-bold tracking-tight mt-1"
                      prefix="$"
                    />
                  ) : (
                    <span className="text-xl font-bold tracking-tight mt-1">
                      $******
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={fetchBalances}
          className="w-full py-4 bg-black/5 hover:bg-black/10 text-white/90 transition-colors duration-200 flex items-center justify-center text-sm font-medium backdrop-blur-sm"
          disabled={isLoading || !isConnected}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {isConnected ? "Refresh" : "Connect Wallet to View Balance"}
        </button>
      </motion.div>
    </div>
  );
}

function AnimatedNumber({
  value,
  className,
  prefix = "",
}: {
  value: number;
  className?: string;
  prefix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        clearInterval(timer);
        current = value;
      }
      setDisplayValue(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(2)}
    </span>
  );
}
