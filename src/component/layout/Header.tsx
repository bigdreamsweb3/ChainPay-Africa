"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Account } from "@/component/web3/account";
import { WalletOptions } from "@/component/web3/wallet-options";
import { appConfig } from "@/app-config";
import { MapPin } from "lucide-react";

function ConnectWallet() {
  const { isConnected } = useAccount();
  return isConnected ? <Account /> : <WalletOptions />;
}

export function Header() {
  return (
    <motion.header
      className="py-3 relative sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Transparent with very subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-chainpay-blue/5 to-transparent"></div>

      {/* Minimal bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
      <div className="absolute bottom-0 left-1/3 right-1/3 h-[1px] bg-chainpay-orange/20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-2">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-xl">
                <Image
                  src={appConfig.appLogo}
                  alt="ChainPay"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </div>


            </motion.div>


            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-brand-primary to-chainpay-blue-light bg-clip-text text-transparent">
                {appConfig.appNameWord1}
                <span className="text-lg sm:text-xl font-semibold text-chainpay-orange">
                  {appConfig.appNameWord2}
                </span>
              </span>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                <MapPin size={12} />
                <span>{appConfig.appCountry}</span>
              </div>
            </div>
          </div>



          {/* Wallet Connection */}
          <div className="flex-shrink-0">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

