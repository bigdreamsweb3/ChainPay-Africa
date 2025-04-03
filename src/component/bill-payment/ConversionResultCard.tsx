"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { TokenData } from "@/types/token";
import Image from "next/image";

interface ConversionResultCardProps {
  selectedTokenData: TokenData;
  creditAmount: string;
  localDisplayAmount: string;
  conversionRate: string;
  isConverting: boolean;
  conversionError: string | null;
  serviceType: string;
}

const ConversionResultCard: React.FC<ConversionResultCardProps> = ({
  selectedTokenData,
  creditAmount,
  localDisplayAmount,
  // conversionRate,
  isConverting,
  conversionError,
  // serviceType,
}) => {
  const formatNumber = (num: string) => {
    return Number(num).toLocaleString("en-NG", { maximumFractionDigits: 2 });
  };

  // const displayServiceType = serviceType
  //   ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
  //   : "Service";

  return (
    <AnimatePresence>
      {selectedTokenData &&
        creditAmount &&
        !isNaN(Number(creditAmount)) &&
        Number(creditAmount) >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 mb-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg">
              {/* Main Content */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  {/* Left Side - Amount to Pay */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-chainpay-gold/10 dark:bg-chainpay-gold/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-chainpay-gold">₦</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Amount
                      </p>
                      <p className="text-sm font-semibold text-chainpay-blue-dark dark:text-chainpay-blue-light">
                        ₦{formatNumber(creditAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Center - Arrow */}
                  <div className="w-5 h-5 rounded-full bg-chainpay-gold/10 dark:bg-chainpay-gold/20 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-chainpay-gold" />
                  </div>

                  {/* Right Side - Amount to Receive */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-chainpay-gold/10 dark:bg-chainpay-gold/20 flex items-center justify-center">
                      <Image
                        src={selectedTokenData?.icon?.trim() || "/placeholder.svg"}
                        alt={`${selectedTokenData?.symbol} icon`}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        You&apos;ll Pay
                      </p>
                      {isConverting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-chainpay-gold" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-chainpay-blue-dark dark:text-chainpay-blue-light">
                            {localDisplayAmount}
                          </span>
                          <span className="text-xs font-semibold text-chainpay-gold">
                            {selectedTokenData?.symbol}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rate and Service Type */}
                {/* <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {displayServiceType} Payment
                  </span>
                  <span className="text-chainpay-gold">
                    Rate: {conversionRate}
                  </span>
                </div> */}

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

export default ConversionResultCard;
