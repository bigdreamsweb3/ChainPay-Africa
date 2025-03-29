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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Payment Summary
                </h3>
              </div>
            </div>

            {/* Main Card */}
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              {/* Token Info Section */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
                    <Image
                      src={selectedTokenData?.icon || "/placeholder.svg"}
                      alt={`${selectedTokenData?.symbol} icon`}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Selected Token</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedTokenData?.symbol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-4 space-y-3">
                {/* Credit Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Credit Amount</span>
                  <span className="text-sm font-medium text-gray-800">
                    {creditAmount.toString()}
                  </span>
                </div>

                {/* Conversion Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Current Rate</span>
                  <span className="text-sm font-medium text-gray-800">
                    {conversionRate}
                  </span>
                </div>

                {/* Final Amount */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 bg-orange-500">
                        {isConverting ? (
                          <Loader2
                            size={14}
                            className="text-white animate-spin"
                          />
                        ) : (
                          <Minus size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        Final Amount
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConverting ? (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="text-xs">Calculating...</span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-800">
                          {localDisplayAmount} {selectedTokenData?.symbol}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {conversionError && (
                  <div className="mt-3 flex items-start gap-2 text-xs bg-red-50 text-red-600 p-2 rounded-lg border border-red-100">
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