"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Minus } from "lucide-react";
import { TokenData } from "@/types/token";
import Image from "next/image";

interface ConversionResultCardProps {
  selectedTokenData: TokenData;
  creditAmount: string;
  localDisplayAmount: string;
  conversionRate: string;
  isConverting: boolean;
  conversionError: string | null;
}

const ConversionResultCard: React.FC<ConversionResultCardProps> = ({
  selectedTokenData,
  creditAmount,
  localDisplayAmount,
  conversionRate,
  isConverting,
  conversionError,
}) => {
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
            className="mt-4 "
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-chainpay-gold/10 dark:bg-chainpay-gold/20 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-chainpay-gold" />
                </div>
                <h3 className="text-sm font-medium text-chainpay-blue-dark dark:text-chainpay-blue-light">
                  Payment Summary
                </h3>
              </div>
            </div>

            {/* Main Card */}
            <div className="rounded-xl bg-white dark:bg-background-dark-card shadow-md overflow-hidden transition-colors duration-300">
              {/* Token Info Section */}
              <div className="p-4 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-border-light dark:border-border-dark flex items-center justify-center bg-white dark:bg-background-dark">
                    <Image
                      src={selectedTokenData?.icon || "/placeholder.svg"}
                      alt={`${selectedTokenData?.symbol} icon`}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted dark:text-text-dark-muted">Selected Token</p>
                    <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                      {selectedTokenData?.symbol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-3 space-y-2.5">
                {/* Credit Units */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted dark:text-text-dark-muted">
                    Credit Amount
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                    {creditAmount.toString()}
                  </span>
                </div>

                {/* Conversion Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted dark:text-text-dark-muted">
                    Current Rate
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                    {conversionRate}
                  </span>
                </div>

                {/* Final Amount */}
                <div className="pt-2.5 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 bg-chainpay-gold border border-chainpay-gold">
                        {isConverting ? (
                          <Loader2
                            size={14}
                            className="text-white animate-spin"
                          />
                        ) : (
                          <Minus size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                        Final Amount
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
                </div>

                {/* Error Message */}
                {conversionError && (
                  <div className="mt-2.5 flex items-start gap-2 text-xs bg-status-error/5 dark:bg-status-error/10 text-status-error p-2 rounded-lg border border-status-error/10">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium leading-tight">
                      {conversionError}
                    </p>
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
