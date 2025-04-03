"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, ExternalLink, Check, AlertCircle, Loader2 } from "lucide-react";
import { SUPPORTED_CHAIN_IDS } from "@/utils/web3/config";
import Image from "next/image";
import { getWalletIcon } from "@/app-config";

export function Account() {
  const { address, chain, isConnected, isConnecting, isDisconnected, isReconnecting, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { chains, switchChain, status: switchStatus } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chainId = useChainId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsNetworkDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchChain = async (chain: (typeof SUPPORTED_CHAIN_IDS)[number]) => {
    try {
      await switchChain({ chainId: chain.id });
      setIsNetworkDropdownOpen(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  useEffect(() => {
    setIsOpen(false);
    setIsNetworkDropdownOpen(false);
  }, [chainId]);

  useEffect(() => {
    if (isDisconnected) {
      setIsOpen(false);
      setIsNetworkDropdownOpen(false);
    }
  }, [isDisconnected]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsOpen(false);
  }, [disconnect]);

  if (!address || !isConnected) return null;

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getConnectionStatus = () => {
    if (isConnecting || isReconnecting) return "connecting";
    if (isConnected) return "connected";
    if (isDisconnected) return "disconnected";
    return "unknown";
  };

  const status = getConnectionStatus();
  const isSwitching = switchStatus === "pending";

  const walletIconSrc = connector
    ? getWalletIcon(connector)
    : "/default-wallet-icon.svg";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark hover:from-chainpay-blue-dark hover:to-[#3B82F6] hover:scale-105 hover:shadow-xl hover:shadow-[#3B82F6]/30 focus:outline-none focus:ring-0 text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isConnected && connector ? (
          <div className="w-5 h-5 rounded-full bg-background-light dark:bg-background-dark-light flex items-center justify-center">
            <Image
              src={walletIconSrc?.trim() || "/default-wallet-icon.svg"}
              alt={`${connector.name} icon`}
              width={20}
              height={20}
              className="w-4 h-4 rounded-full object-contain"
              onError={(e) => (e.currentTarget.src = "/default-wallet-icon.svg")}
            />
          </div>
        ) : ensAvatar ? (
          <div className="w-5 h-5 rounded-full bg-background-light dark:bg-background-dark-light flex items-center justify-center">
            <Image
              src={ensAvatar?.trim() || "/placeholder.svg"}
              alt="ENS Avatar"
              width={20}
              height={20}
              className="w-4 h-4 rounded-full"
            />
          </div>
        ) : (
            <div className="w-5 h-5 rounded-full bg-background-light dark:bg-background-dark-light flex items-center justify-center">
            <User className="w-4 h-4 text-text-primary dark:text-text-dark-primary" />
          </div>
        )}
        <span className="text-white hidden sm:inline">{ensName || shortenedAddress}</span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-background-dark-card rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* Connection Status Bar */}
            <div
              className={`px-3 py-2 text-xs font-medium flex items-center ${
                status === "connected"
                  ? "bg-status-success/5 dark:bg-status-success/10 text-status-success"
                  : status === "connecting"
                  ? "bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary"
                  : "bg-status-error/5 dark:bg-status-error/10 text-status-error"
              }`}
            >
              {status === "connected" && <Check className="w-3 h-3 mr-1.5" />}
              {status === "connecting" && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}
              {status === "disconnected" && <AlertCircle className="w-3 h-3 mr-1.5" />}
              {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
            </div>

            {/* Account Info */}
            <div className="p-3">
              <div className="flex items-center space-x-3">
                {ensAvatar ? (
                  <Image
                    src={ensAvatar?.trim() || "/placeholder.svg"}
                    alt="ENS Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold text-text-primary dark:text-text-dark-primary truncate">
                    {ensName || `${chain?.name || "Unknown"} Account`}
                  </h3>
                  <p className="text-xs text-text-muted dark:text-text-dark-muted font-mono truncate">
                    {shortenedAddress}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        status === "connected"
                          ? "bg-status-success"
                          : status === "connecting"
                          ? "bg-brand-primary"
                          : "bg-status-error"
                      }`}
                    />
                    <span className="text-xs text-text-muted dark:text-text-dark-muted">
                      {chain?.name || "Unknown Network"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-1.5 space-y-1">
              {/* View on Explorer */}
              <a
                href={`${chain?.blockExplorers?.default?.url || "https://etherscan.io"}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-background-light dark:hover:bg-background-dark-light rounded-md transition-colors duration-150 focus:outline-none"
              >
                <ExternalLink className="w-4 h-4 text-brand-primary" />
                <span>View on Explorer</span>
              </a>

              {/* Switch Network Section */}
              <div className="relative">
                <button
                  onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                  disabled={isSwitching}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-background-light dark:hover:bg-background-dark-light rounded-md transition-colors duration-150 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    {isSwitching ? (
                      <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-primary" />
                      </div>
                    )}
                    <span>Switch Network</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-primary transition-transform ${
                      isNetworkDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isNetworkDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden z-50"
                    >
                      <div className="mt-1 space-y-1 pl-2 pr-1 py-1 bg-background-light dark:bg-background-dark-light rounded-md">
                        {chains.map((supportedChain) => (
                          <button
                            key={supportedChain.id}
                            onClick={() => handleSwitchChain(supportedChain)}
                            disabled={isSwitching}
                            className={`flex items-center w-full px-2 py-1.5 text-xs rounded-md focus:outline-none ${
                              supportedChain.id === chainId
                                ? "bg-brand-primary/10 dark:bg-brand-primary/20 text-text-primary dark:text-text-dark-primary"
                                : "hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 text-text-primary dark:text-text-dark-primary"
                            }`}
                          >
                            {supportedChain.id === chainId ? (
                              <Check className="w-3 h-3 mr-2 text-brand-primary" />
                            ) : (
                              <div className="w-3 h-3 mr-2" />
                            )}
                            {supportedChain.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Disconnect Option */}
              <button
                onClick={handleDisconnect}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-status-error hover:bg-status-error/5 dark:hover:bg-status-error/10 rounded-md transition-colors duration-150 focus:outline-none"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}