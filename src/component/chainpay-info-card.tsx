"use client"

import Image from "next/image"
import { appConfig } from "@/app-config"
import { Globe, Zap } from "lucide-react"

export default function ChainPayInfoCard() {
  const countryTheme = appConfig.countryTheme[appConfig.appCountry]

  return (
    <div className="max-w-md mx-auto">
      <div
        className="relative rounded-xl overflow-hidden p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 border border-gray-200"
      >
        {/* Bold Gradient Background */}
        <div
          className={`absolute inset-0 ${countryTheme.gradientFrom} ${countryTheme.gradientTo} bg-gradient-to-br opacity-20`}
        />

        {/* Logo & Title */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border border-gray-200 bg-white`}
            >
              <Zap size={16} className="text-chainpay-blue sm:hidden" />
              <Zap size={18} className="text-chainpay-blue hidden sm:block" />
            </div>

            <div className="z-10">
              <h2 className="text-sm sm:text-base font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-chainpay-blue bg-clip-text text-transparent">
                Fast, Reliable Payments
              </h2>
            </div>
          </div>

          {/* Vibrant Badge */}
          <div
            className={`bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 flex items-center gap-1 border border-gray-200`}
          >
            <Globe size={10} className="text-chainpay-blue" />
            <span className="truncate max-w-[80px]">{appConfig.appCountry}</span>
          </div>
        </div>

        {/* Description with Highlight */}
        <div className="z-10">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            <span className="font-semibold text-chainpay-blue">Blockchain-powered</span> bill payments across Africa, secure and immutable.
          </p>
        </div>

        {/* Subtle Logo */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-10 hidden sm:block">
          <Image
            src="/images/logo.jpg"
            alt="ChainPay App Logo"
            width={60}
            height={60}
            className="rounded-full border border-gray-200"
          />
        </div>
      </div>
    </div>
  )
}