"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { TokenData } from "@/types/token";

interface ConversionRateProps {
  selectedTokenData: TokenData;
  creditAmount: string;
  localDisplayAmount: string;
  conversionRate: string;
  isConverting: boolean;
  conversionError: string | null;
  serviceType: string;
}

const ConversionRate: React.FC<ConversionRateProps> = ({
  selectedTokenData,
  creditAmount,
  localDisplayAmount,
  conversionRate,
  isConverting,
  conversionError,
  serviceType,
}) => {
  const formatNumber = (num: string) => {
    return Number(num).toLocaleString("en-NG", { maximumFractionDigits: 2 });
  };

  const displayServiceType = serviceType
    ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
    : "Service";

  return (
    <AnimatePresence>
      {selectedTokenData && selectedTokenData?.symbol && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg">
              <div className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    Rate: {conversionRate.replace("USD", selectedTokenData.symbol)}
                  </span>
                  <span className="font-semibold text-chainpay-gold">
                    {displayServiceType} Payment
                  </span>
                </div>

                {/* Error Message */}
                {conversionError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <p className="truncate">{conversionError}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};

export default ConversionRate;
