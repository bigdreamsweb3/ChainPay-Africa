"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { appConfig } from "@/app-config";

export default function ChainPayInfoCard() {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <motion.div
        className="relative bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl shadow-sm overflow-hidden p-6 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-brand-primary/80" />

        {/* Logo & Title */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src="/logo-removebg.png"
                alt="ChainPay Logo"
                width={36}
                height={36}
                className="rounded-full border border-white/10"
              />
            </motion.div>
            {/* <span className="text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              {appConfig.appName}<span className="text-brand-secondary">{appConfig.appSubName}</span>
            </span> */}
          </div>

          {/* Animated Badge */}
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 px-3 py-1 rounded-full text-xs font-medium text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {appConfig.appRegion} 🌍
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="z-10"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Fast, Reliable Payments
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            Seamless transactions across Africa, anytime.
          </p>
        </motion.div>

        {/* Faded Background Logo */}
        <motion.div
          className="absolute top-1/2 right-4 sm:right-6 -translate-y-1/2 opacity-10 sm:opacity-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Image
            src="/logo.jpg"
            alt="ChainPay App Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
