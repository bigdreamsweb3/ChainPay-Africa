"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { appConfig } from "@/app-config"
import { Globe, Zap } from "lucide-react"
// import { useIsTokenAccepted } from "@/hooks/interact/TokenContract"

export default function ChainPayInfoCard() {
  // const isTokenAccepted = useIsTokenAccepted();
  // console.log(isTokenAccepted);

  return (
    <div className="w-full max-w-md mx-auto mb-2">
      <motion.div
        className="relative rounded-xl shadow-lg overflow-hidden p-4 flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background Gradient - Using ChainPay brand colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-chainpay-blue-dark via-chainpay-blue to-chainpay-blue-light" />

        {/* Blockchain Pattern Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[url('/images/grid-pattern.svg')]" />

        {/* Hexagon Pattern - Blockchain Style */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(2) rotate(0)">
                <path d="M0,20 17.3,10 17.3,30 z M17.3,10 34.6,20 17.3,30 z M34.6,0 34.6,20 17.3,10 z M17.3,30 34.6,20 34.6,40 z" fill="none" stroke="#fff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Animated Glow Effect - Using ChainPay theme colors */}
        <motion.div
          className="absolute -inset-1 rounded-xl opacity-30 blur-xl"
          style={{
            background: "linear-gradient(90deg, #0088CC, #00AAFF, #FFAA00, #0088CC)"
          }}
          animate={{
            backgroundPosition: ["0% center", "200% center"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Logo & Title */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shadow-lg border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Zap size={18} className="text-chainpay-orange" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="z-10"
            >
              <h2 className="text-base font-bold text-white">Fast, Reliable Payments</h2>
            </motion.div>
          </div>

          {/* Animated Badge */}
          <motion.div
            className={`bg-gradient-to-r from-green-600 to-green-500 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md border-green-500/30 flex items-center gap-1`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Globe size={10} />
            {appConfig.appCountry}
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="z-10"
        >
          <p className="text-sm text-blue-100">Blockchain-powered transactions across Africa, secure and immutable.</p>


        </motion.div>

        {/* Faded Background Logo */}
        <motion.div
          className="absolute top-1/2 right-3 -translate-y-1/2 opacity-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Image src="/images/logo.jpg" alt="ChainPay App Logo" width={60} height={60} className="rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}

