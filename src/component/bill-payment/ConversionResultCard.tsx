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
            className="mt-4"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-chainpay-orange/10 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-chainpay-orange" />
                </div>
                <h3 className="text-sm font-medium text-chainpay-blue-dark">
                  Payment Summary
                </h3>
              </div>
            </div>

            {/* Main Card */}
            <div className="rounded-xl bg-white border border-chainpay-blue-light/20 overflow-hidden shadow-sm">
              {/* Token Info Section */}
              <div className="p-3 bg-gradient-to-r from-chainpay-blue-light/5 via-white to-chainpay-blue-light/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-chainpay-blue-light/20 flex items-center justify-center bg-white">
                    <Image
                      src={selectedTokenData?.icon || "/placeholder.svg"}
                      alt={`${selectedTokenData?.symbol} icon`}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-chainpay-blue-dark/60">
                      Selected Token
                    </p>
                    <p className="text-sm font-medium text-chainpay-blue-dark">
                      {selectedTokenData?.symbol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-3 space-y-2.5">
                {/* Credit Units */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-chainpay-blue-dark/60">
                    Credit Units
                  </span>
                  <span className="text-sm font-medium text-chainpay-blue-dark">
                    {creditAmount.toString()}
                  </span>
                </div>

                {/* Conversion Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-chainpay-blue-dark/60">
                    Current Rate
                  </span>
                  <span className="text-sm font-medium text-chainpay-blue-dark">
                    {conversionRate}
                  </span>
                </div>

                {/* Final Amount */}
                <div className="pt-2.5 border-t border-chainpay-blue-light/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 bg-chainpay-orange  border border-chainpay-orange">
                        {isConverting ? (
                          <Loader2
                            size={14}
                            className="text-white animate-spin"
                          />
                        ) : (
                          <Minus size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-chainpay-blue-dark">
                        Final Amount
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConverting ? (
                        <div className="flex items-center gap-1.5 text-chainpay-blue-dark/60">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="text-xs">Calculating...</span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-chainpay-blue-dark">
                          {localDisplayAmount} {selectedTokenData?.symbol}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {conversionError && (
                  <div className="mt-2.5 flex items-start gap-2 text-xs bg-red-50 text-red-600 p-2 rounded-lg border border-red-100">
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
