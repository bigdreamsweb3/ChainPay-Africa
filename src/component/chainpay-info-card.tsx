"use client"

import Image from "next/image"
import { appConfig } from "@/app-config"
import { Globe, Zap } from "lucide-react"

export default function ChainPayInfoCard() {
  // Get country theme colors
  const countryTheme = appConfig.countryTheme[appConfig.appCountry]

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative rounded-xl overflow-hidden p-4 flex flex-col gap-3 border border-gray-200"
      >
        {/* Simple background color */}
        <div className={`absolute inset-0 ${countryTheme.gradientFrom} opacity-10`} />

        {/* Logo & Title */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center border border-gray-200 bg-white`}
            >
              <Zap size={18} className="text-chainpay-blue" />
            </div>

            <div className="z-10">
              <h2 className="text-base font-bold text-gray-800">Fast, Reliable Payments</h2>
            </div>
          </div>

          {/* Simple badge */}
          <div
            className={`bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1 border border-gray-200`}
          >
            <Globe size={10} />
            {appConfig.appCountry}
          </div>
        </div>

        {/* Description */}
        <div className="z-10">
          <p className="text-sm text-gray-600">Blockchain-powered bill payments across Africa, secure and immutable.</p>
        </div>

        {/* Simple logo */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-10">
          <Image src="/images/logo.jpg" alt="ChainPay App Logo" width={60} height={60} className="rounded-full" />
        </div>
      </div>
    </div>
  )
}

