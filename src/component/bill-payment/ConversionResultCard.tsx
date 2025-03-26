"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Minus, Loader2 } from "lucide-react";

interface ConversionResultCardProps {
  selectedTokenData: any; // Replace with the appropriate type for selectedTokenData
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
            className="mt-6 mb-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedTokenData?.icon || "/placeholder.svg"}
                    alt={`${selectedTokenData?.symbol} icon`}
                    className="w-6 h-6"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      Payment Details
                    </h3>
                    <p className="text-xs text-gray-900">
                      Your payment will be processed in{" "}
                      {selectedTokenData?.symbol}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Credit Units</span>
                  <span className="font-medium text-gray-900">
                    {creditAmount.toString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Current Rate</span>
                  <span className="font-medium text-gray-900">
                    {conversionRate}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 bg-orange-500 border border-orange-200">
                      {isConverting ? (
                        <Loader2 size={14} className="text-white animate-spin" />
                      ) : (
                        <Minus size={14} className="text-white" />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">
                      Final Amount
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {isConverting ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Calculating...
                      </span>
                    ) : (
                      <>
                        {localDisplayAmount} {selectedTokenData?.symbol}
                      </>
                    )}
                  </span>
                </div>

                {conversionError && (
                  <div className="flex items-center gap-2 text-xs text-chainpay-orange-dark bg-chainpay-orange-light/20 p-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {conversionError}
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
