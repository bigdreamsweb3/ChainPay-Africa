"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, Minus, Info } from "lucide-react";
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
  conversionRate,
  isConverting,
  conversionError,
  serviceType,
}) => {
  // Parse numbers for calculation display
  const creditNum = parseFloat(creditAmount);
  const rateNum = parseFloat(conversionRate.replace(/[^0-9.]/g, '')); // Extract number from rate string
  const tokenAmountNum = parseFloat(localDisplayAmount);

  return (
    <AnimatePresence>
      {selectedTokenData &&
        creditAmount &&
        !isNaN(creditNum) &&
        creditNum >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-4"
          >
            <div className="rounded-xl bg-white dark:bg-background-dark-card shadow-md overflow-hidden transition-colors duration-300">
              {/* Token Info Section */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-background-dark">
                    <Image
                      src={selectedTokenData?.icon || "/placeholder.svg"}
                      alt={`${selectedTokenData?.symbol} icon`}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-dark-muted">
                      Selected Token
                    </p>
                    <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                      {selectedTokenData?.symbol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="px-4 py-4 space-y-4">
                {/* Conversion Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-muted dark:text-text-dark-muted">
                        Credit Amount (NGN)
                      </span>
                      <div className="relative group">
                        <Info className="w-3 h-3 text-text-muted cursor-help" />
                        <div className="absolute hidden group-hover:block -top-8 left-4 bg-gray-800 text-white text-xs rounded p-1">
                          Amount in Nigerian Naira
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                      ₦{creditAmount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-muted dark:text-text-dark-muted">
                        Conversion Rate
                      </span>
                      <div className="relative group">
                        <Info className="w-3 h-3 text-text-muted cursor-help" />
                        <div className="absolute hidden group-hover:block -top-8 left-4 bg-gray-800 text-white text-xs rounded p-1 w-32">
                          1 {selectedTokenData?.symbol} = {conversionRate} NGN
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                      {conversionRate}
                    </span>
                  </div>

                  {serviceType === "airtime" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-text-muted dark:text-text-dark-muted">
                          NGN per Credit
                        </span>
                        <div className="relative group">
                          <Info className="w-3 h-3 text-text-muted cursor-help" />
                          <div className="absolute hidden group-hover:block -top-8 left-4 bg-gray-800 text-white text-xs rounded p-1">
                            1 Credit = 1 NGN
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                        1:1
                      </span>
                    </div>
                  )}
                </div>

                {/* Calculation Explanation */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted dark:text-text-dark-muted">
                      Calculation:
                    </span>
                    {isConverting ? (
                      <div className="flex items-center gap-1.5 text-text-muted dark:text-text-dark-muted">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-xs">Calculating...</span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-primary dark:text-text-dark-primary">
                        ₦{creditAmount} ÷ {rateNum} = {tokenAmountNum.toFixed(6)} {selectedTokenData?.symbol}
                      </span>
                    )}
                  </div>
                </div>

                {/* Final Amount */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 bg-chainpay-gold">
                        {isConverting ? (
                          <Loader2 size={14} className="text-white animate-spin" />
                        ) : (
                          <Minus size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                        You Pay
                      </span>
                    </div>
                    {isConverting ? (
                      <div className="flex items-center gap-1.5 text-text-muted dark:text-text-dark-muted">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-xs">Calculating...</span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                        {localDisplayAmount} {selectedTokenData?.symbol}
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {conversionError && (
                  <div className="mt-3 flex items-start gap-2 text-xs bg-status-error/5 dark:bg-status-error/10 text-status-error p-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium leading-tight">{conversionError}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};

export default ConversionResultCard;