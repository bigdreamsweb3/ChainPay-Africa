"use client";

import { Zap, Shield, ArrowRight } from "lucide-react";

export default function ChainPayInfoCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-lg overflow-hidden shadow-md">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-chainpay-blue-dark to-chainpay-blue"></div>

        {/* Content */}
        <div className="relative p-5">
          <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-chainpay-gold/20 to-chainpay-gold/10 flex items-center justify-center">
                <Zap size={24} className="text-chainpay-gold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Pay Bills with Crypto
                </h2>
                <p className="text-sm font-medium text-chainpay-gold mt-0.5 whitespace-nowrap">
                  Fast & Secure Crypto Payments
                </p>
              </div>
            </div>

            {/* Features Grid */}
            {/* <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-blue-50/90">
                <Shield className="w-4 h-4 text-chainpay-gold" />
                <span className="text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-blue-50/90">
                <ArrowRight className="w-4 h-4 text-chainpay-gold" />
                <span className="text-sm">Instant Processing</span>
              </div>
            </div> */}

            {/* Description */}
            {/* <p className="text-sm text-blue-50/80 leading-relaxed">
              Pay for airtime, data, electricity, and more using USDC or BNB on Binance Smart Chain. Fast, secure, and borderless transactions.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
