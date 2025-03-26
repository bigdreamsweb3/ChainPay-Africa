"use client";

import { getAvailableChains } from "@/utils/web3/config";
import React, { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { AnimatePresence, motion } from "framer-motion";

interface NetworkSwitchNotificationProps {
  className?: string;
}

export default function NetworkSwitchNotification({
  className,
}: NetworkSwitchNotificationProps) {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showNotification, setShowNotification] = useState(false);

  const availableChains = getAvailableChains();
  const targetChain = availableChains[0];

  const onSwitch = async () => {
    if (chain?.id !== targetChain.id) {
      try {
        switchChain({ chainId: targetChain.id });
        setShowNotification(true);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    }
  };

  useEffect(() => {
    setShowNotification(!!address && chain?.id !== targetChain.id);
  }, [address, chain]);

  return (
    <div
      className={`${className} flex items-center justify-end w-full max-w-sm mx-auto px-4 pt-4 lg:px-8 ${showNotification ? "block" : "hidden"}`}
    >
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border-l-4 border-brand-primary p-4 rounded-lg shadow-md max-w-sm"
          >
            <h2 className="font-semibold text-brand-primary text-lg">
              Switch to {targetChain.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              This application is only available on the {targetChain.name} network. Please switch to continue.
            </p>
            <button
              onClick={onSwitch}
              className="mt-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition duration-200"
            >
              Switch Network
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
