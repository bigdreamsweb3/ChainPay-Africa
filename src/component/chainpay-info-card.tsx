"use client";

import Image from "next/image";
import { appConfig } from "@/app-config";
import { Globe, Zap } from "lucide-react";

export default function ChainPayInfoCard() {
  const countryTheme = appConfig.countryTheme[appConfig.appCountry];

  return (
    <div className="max-w-md mx-auto bg-[#F1F5F9] rounded-xl p-3 sm:p-4">
      <div className="relative rounded-xl overflow-hidden p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 border border-[#E2E8F0] bg-[#FFFFFF]">
        {/* Subtle Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[#00AAFF]/10 to-transparent opacity-20`}
        />

        {/* Logo & Title */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border border-[#E2E8F0] bg-[#FFFFFF]">
              <Zap size={16} className="text-[#0066CC] sm:hidden" />
              <Zap size={18} className="text-[#0066CC] hidden sm:block" />
            </div>
            <div className="z-10">
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">
                Instant Blockchain Payments
              </h2>
            </div>
          </div>

          {/* Country Badge */}
          <div className="bg-[#FF9900] px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#FFFFFF] flex items-center gap-1">
            <Globe size={10} className="text-[#FFFFFF]" />
            <span className="truncate max-w-[80px]">{appConfig.appCountry}</span>
          </div>
        </div>

        {/* Description with Highlight */}
        <div className="z-10">
          <p className="text-xs sm:text-sm text-[#334155] line-clamp-2">
            Pay bills across Africa with{" "}
            <span className="font-semibold text-[#00AAFF]">blockchain</span>{" "}
            tech—secure, fast, and immutable.
          </p>
        </div>

        {/* Subtle Logo */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-10 hidden sm:block">
          <Image
            src="/images/logo.jpg"
            alt="ChainPay App Logo"
            width={60}
            height={60}
            className="rounded-full border border-[#E2E8F0]"
          />
        </div>
      </div>
    </div>
  );
}