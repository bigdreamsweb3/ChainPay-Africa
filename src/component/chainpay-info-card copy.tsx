"use client"

import Image from "next/image"
import { appConfig } from "@/app-config"
import { Globe, Zap } from "lucide-react"
// import Tilt from "react-parallax-tilt" // For 3D tilt effect on hover

export default function ChainPayInfoCard() {
  const countryTheme = appConfig.countryTheme[appConfig.appCountry]

  return (
    <div className="min-h-[300px] bg-gradient-to-b from-[#0F172A] to-[#1E293B] py-8 flex items-center justify-center">
      <div >
        <div
          className="relative rounded-2xl overflow-hidden p-5 flex flex-col gap-4 border border-[#E2E8F0]/20 bg-[#1E3A8A]/10 backdrop-blur-lg shadow-2xl max-w-sm mx-auto"
        >
          {/* Subtle Particle Effect Background */}
          <div className="absolute inset-0 bg-[url('/images/particle-bg.png')] opacity-10" />

          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-2xl border border-[#60A5FA]/30 shadow-[0_0_15px_rgba(96,165,250,0.3)]" />

          {/* Logo & Title */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#E2E8F0]/30 bg-[#1E3A8A]/20 backdrop-blur-sm shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <Zap size={24} className="text-[#60A5FA] animate-pulse" />
              </div>
              <div className="z-10">
                <h2 className="text-lg font-bold bg-gradient-to-r from-[#60A5FA] to-[#1E3A8A] bg-clip-text text-transparent">
                  Instant Blockchain Payments
                </h2>
              </div>
            </div>

            {/* Country Badge with Glow */}
            <div
              className="bg-gradient-to-r from-[#60A5FA] to-[#1E3A8A] px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-[0_0_8px_rgba(96,165,250,0.5)]"
            >
              <Globe size={12} className="text-white" />
              <span className="truncate max-w-[80px]">{appConfig.appCountry}</span>
            </div>
          </div>

          {/* Description with Gradient Highlights */}
          <div className="z-10">
            <p className="text-sm text-gray-200 line-clamp-2">
              Pay bills across Africa with{" "}
              <span className="font-semibold bg-gradient-to-r from-[#60A5FA] to-[#7C3AED] bg-clip-text text-transparent">
                blockchain
              </span>{" "}
              tech—secure, fast, and{" "}
              <span className="font-semibold text-[#7C3AED]">immutable</span>.
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="z-10">
            <button
              className="w-full py-2 bg-gradient-to-r from-[#60A5FA] to-[#1E3A8A] text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:from-[#1E3A8A] hover:to-[#60A5FA] hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]"
            >
              Start Paying Now
            </button>
          </div>

          {/* Subtle Logo in Background */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-20 hidden sm:block">
            <Image
              src="/images/logo.jpg"
              alt="ChainPay App Logo"
              width={80}
              height={80}
              className="rounded-full border border-[#E2E8F0]/30"
            />
          </div>
        </div>
      </div>
    </div>
  )
}