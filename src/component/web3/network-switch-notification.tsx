"use client";

import { DEFAULT_CHAIN } from "@/utils/web3/config";
import React, { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { AnimatePresence, motion } from "framer-motion";

interface NetworkSwitchNotificationProps {
  className?: string;
}

function NetworkSwitchNotification({
  className,
}: NetworkSwitchNotificationProps) {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showNotification, setShowNotification] = useState(false);

  const onSwitch = async () => {
    if (chain?.id !== DEFAULT_CHAIN.id) {
      try {
        await switchChain({ chainId: DEFAULT_CHAIN.id });
        setShowNotification(true);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    }
  };

  useEffect(() => {
    if (!address || chain?.id === DEFAULT_CHAIN.id) {
      setShowNotification(false);
    } else {
      setShowNotification(true);
    }
  }, [address, chain]);

  return (
    <div
      className={`${className} ${
        showNotification ? "" : "hidden"
      } z-50 flex items-center justify-end w-full max-w-md mx-auto px-4 py-4 lg:px-8`}
    >
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border-l-4 border-brand-primary p-4 rounded-lg shadow-sm`}
          >
            <div className="">
              <h2 className="font-bold text-lg text-brand-primary">
                Switch to {DEFAULT_CHAIN.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                This application is only available on the {DEFAULT_CHAIN.name}{" "}
                network. Please switch to the {DEFAULT_CHAIN.name} network to
                continue using the app.
              </p>
              <button
                onClick={onSwitch}
                className="mt-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Switch Network
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NetworkSwitchNotification;
