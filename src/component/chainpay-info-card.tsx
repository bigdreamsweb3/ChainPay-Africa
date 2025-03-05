"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { appConfig } from "@/app-config"
import { useIsTokenAccepted } from "@/hooks/interact/TokenContract";


export default function ChainPayInfoCard() {
  const isTokenAccepted = useIsTokenAccepted();
  console.log(isTokenAccepted);


  return (
    <div className="w-full max-w-md mx-auto mb-2">
      <motion.div
        className="relative bg-gradient-to-br from-brand-primary to-brand-accent rounded-md shadow-sm overflow-hidden p-3 flex flex-col gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-brand-primary/80" />

        {/* Logo & Title */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Image
                src="/images/logo-removebg.png"
                alt="ChainPay Logo"
                width={24}
                height={24}
                className="rounded-full border border-white/10"
              />
            </motion.div>
          </div>

          {/* Animated Badge */}
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {appConfig.appRegion} 🌍
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="z-10"
        >
          <h2 className="text-base font-semibold text-white">Fast, Reliable Payments</h2>
          <p className="text-xs text-gray-300">Seamless transactions across Africa, anytime.</p>
        </motion.div>

        {/* Faded Background Logo */}
        <motion.div
          className="absolute top-1/2 right-2 -translate-y-1/2 opacity-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Image src="/images/logo.jpg" alt="ChainPay App Logo" width={40} height={40} className="rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}

