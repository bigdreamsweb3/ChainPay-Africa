"use client";

import { useState, useEffect, useRef } from "react";
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

export function Account() {
  const { address, chain, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount();
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

  if (!address) return null;

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleSwitchChain = (chain: (typeof SUPPORTED_CHAIN_IDS)[number]) => {
    switchChain({ chainId: chain.id });
    setIsNetworkDropdownOpen(false);
  };

  const getConnectionStatus = () => {
    if (isConnecting || isReconnecting) return "connecting";
    if (isConnected) return "connected";
    if (isDisconnected) return "disconnected";
    return "unknown";
  };

  const status = getConnectionStatus();
  const isSwitching = switchStatus === "pending";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white hover:opacity-90 active:scale-95 px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50"
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
      >
        {ensAvatar ? (
          <Image
            src={ensAvatar || "/placeholder.svg"}
            alt="ENS Avatar"
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}

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
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-border-light overflow-hidden"
          >
            {/* Connection Status Bar */}
            <div className={`px-3 py-2 text-xs font-medium flex items-center ${
              status === "connected" 
                ? "bg-status-success/5 text-status-success" 
                : status === "connecting" 
                ? "bg-brand-primary/5 text-brand-primary"
                : "bg-status-error/5 text-status-error"
            }`}>
              {status === "connected" && <Check className="w-3 h-3 mr-1.5" />}
              {status === "connecting" && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}
              {status === "disconnected" && <AlertCircle className="w-3 h-3 mr-1.5" />}
              {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
            </div>

            {/* Account Info */}
            <div className="p-3 border-b border-border-light">
              <div className="flex items-center space-x-3">
                {ensAvatar ? (
                  <Image
                    src={ensAvatar || "/placeholder.svg"}
                    alt="ENS Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-border-light"
                  />
                ) : (
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center border-2 border-border-light">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {ensName || `${chain?.name} Account`}
                  </h3>
                  <p className="text-xs text-text-muted font-mono truncate">
                    {shortenedAddress}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      status === "connected" 
                        ? "bg-status-success" 
                        : status === "connecting" 
                        ? "bg-brand-primary" 
                        : "bg-status-error"
                    }`} />
                    <span className="text-xs text-text-muted">{chain?.name || "Unknown Network"}</span>
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
                className="flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-light rounded-md transition-colors duration-150 focus:outline-none"
              >
                <ExternalLink className="w-4 h-4 text-brand-primary" />
                <span>View on Explorer</span>
              </a>

              {/* Switch Network Section */}
              <div className="relative">
                <button
                  onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                  disabled={isSwitching}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-text-primary hover:bg-background-light rounded-md transition-colors duration-150 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    {isSwitching ? (
                      <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border-light flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-primary" />
                      </div>
                    )}
                    <span>Switch Network</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-primary transition-transform ${isNetworkDropdownOpen ? "rotate-180" : ""}`}
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
                      <div className="mt-1 space-y-1 pl-2 pr-1 py-1 bg-background-light rounded-md">
                        {chains.map((supportedChain) => (
                          <button
                            key={supportedChain.id}
                            onClick={() => handleSwitchChain(supportedChain)}
                            disabled={isSwitching}
                            className={`flex items-center w-full px-2 py-1.5 text-xs rounded-md focus:outline-none ${
                              supportedChain.id === chainId 
                                ? "bg-brand-primary/10 text-text-primary" 
                                : "hover:bg-brand-primary/5 text-text-primary"
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
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-status-error hover:bg-status-error/5 rounded-md transition-colors duration-150 focus:outline-none"
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