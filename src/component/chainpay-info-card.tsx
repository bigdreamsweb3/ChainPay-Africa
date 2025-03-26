"use client";

import Image from "next/image";
import { appConfig } from "@/app-config";
import { Globe, Zap } from "lucide-react";

export default function ChainPayInfoCard() {


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-xl shadow-sm overflow-hidden p-4 flex flex-col gap-3">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-chainpay-blue-dark to-chainpay-blue"></div>
        <div className="absolute inset-0 opacity-15 bg-[url('/images/grid-pattern.svg')]"></div>
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(2) rotate(0)">
                <path d="M0,20 17.3,10 17.3,30 z M17.3,10 34.6,20 17.3,30 z M34.6,0 34.6,20 17.3,10 z M17.3,30 34.6,20 34.6,40 z" fill="none" stroke="#fff" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#hexagons)"></rect>
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-xl opacity-30 blur-xl" style={{ background: "linear-gradient(90deg, rgb(10, 37, 64), rgb(0, 136, 204), rgb(255, 170, 0), rgb(10, 37, 64)) 93.775% center;" }}></div>
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shadow-lg border border-white/20">
              <Zap size={18} className="text-chainpay-orange" />
            </div>
            <div className="z-10">
              <h2 className="text-base font-bold text-white">Fast, Reliable Payments</h2>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md border-green-500/30 flex items-center gap-1">
            <Globe size={10} className="text-white" />
            <span className="truncate max-w-[80px]">{appConfig.appCountry}</span>
          </div>
        </div>
        <div className="z-10">
          <p className="text-sm text-blue-50">Blockchain-powered bill payments across Africa, secure and immutable.</p>
        </div>
        <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-10">
          <Image
            alt="ChainPay App Logo"
            loading="lazy"
            width={60}
            height={60}
            decoding="async"
            className="rounded-full"
            src="/images/logo.jpg"
          />
        </div>
      </div>
    </div>
  );
}