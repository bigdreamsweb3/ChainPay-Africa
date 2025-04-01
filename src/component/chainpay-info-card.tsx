"use client";

import { Zap } from "lucide-react";

export default function ChainPayInfoCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-lg overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-chainpay-blue-dark to-chainpay-blue"></div>

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Zap size={16} className="text-brand-accent" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">
                  Pay Bills with Crypto
                </h2>
                <p className="text-sm text-blue-50/80 mt-0.5">
                  Fast, secure, and seamless crypto payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
