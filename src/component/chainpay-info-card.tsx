"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ChainPayInfoCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="relative bg-gradient-to-br from-brand-primary to-brand-accent rounded-3xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background Image with Gradient */}
        <div className="absolute inset-0">
          <Image
            src="/logo.jpg"
            alt="ChainPay Logo Background"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            className="opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark to-brand-primary" />
        </div>

        {/* Glowing Effect */}
        <div className="absolute top-1/2 right-20 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2" />

        {/* Main Content */}
        <div className="relative p-6 z-10">
          {/* Header with Logo and Tag */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {/* <Image
                src="/logo.jpg"
                alt="ChainPay Logo"
                width={48}
                height={48}
                className="rounded-full shadow-sm border border-brand-primary/20"
              /> */}

              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Chain<span className="text-brand-secondary">Pay</span>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">Africa</span>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3 mb-6">
            <h2 className="text-2xl font-bold text-white">
              Experience Fast Payments
            </h2>
            <p className="text-gray-300">
              Seamless transactions across Africa, anytime.
            </p>
          </div>

          {/* Social Buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="#"
              className="inline-block text-brand-primary hover:text-brand-primary/80 transition-colors text-sm font-medium"
            >
              Learn more →
            </Link>
            <div className="flex items-center gap-2">
              <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm">
                Discord
              </button>
              <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm">
                Telegram
              </button>
            </div>
          </div>
        </div>

        {/* Large Logo on Right */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-30">
          <Image
            src="/logo.jpg"
            alt="ChainPay App Logo"
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
