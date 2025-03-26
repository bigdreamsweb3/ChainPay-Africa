"use client";

import { useState, useEffect, useRef } from "react";
import { useConnect, Connector, useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronRight, CheckCircle, XCircle, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Account } from "./account";

export function WalletButton() {
  const { isConnected } = useAccount();
  return <>{isConnected ? <Account /> : <WalletOptions />}</>;
}

export function WalletOptions() {
  const { connectors, connect, error, isPending } = useConnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "success" | "error"
  >("idle");
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedConnector) {
      if (isPending) {
        setConnectionStatus("connecting");
      } else if (error) {
        setConnectionStatus("error");
      } else if (!isPending && connectionStatus === "connecting") {
        setConnectionStatus("success");
        setTimeout(() => {
          setIsModalOpen(false);
          setConnectionStatus("idle");
          setSelectedConnector(null);
        }, 1500);
      }
    }
  }, [isPending, error, selectedConnector, connectionStatus]);

  const handleConnect = async (connector: Connector) => {
    setSelectedConnector(connector.uid);
    setConnectionStatus("connecting");
    try {
      connect({ connector });
    } catch (err) {
      console.error("Connection error:", err);
      setConnectionStatus("error");
    }
  };

  if (!isClient) {
    return (
      <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        <span>Loading wallet options...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Connect Wallet Button with clear CTA */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center space-x-2 bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white hover:opacity-90 active:scale-95 px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 ${
          isPending
            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white hover:opacity-90 active:scale-95"
        }`}
        aria-label="Connect your wallet to continue"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Wallet Connection Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[50] pointer-events-auto">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-md bg-white shadow-2xl rounded-lg overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close wallet connection modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#0099FF]" />
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select your preferred wallet provider to continue
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {connectors.map((connector) => (
                      <motion.button
                        key={connector.uid}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleConnect(connector);
                        }}
                        disabled={isPending}
                        className={`w-full p-3 flex items-center justify-between rounded-lg transition-colors ${
                          selectedConnector === connector.uid
                            ? "bg-[#0099FF]/10 border border-[#0099FF]"
                            : "hover:bg-gray-50 border border-gray-100"
                        }`}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 relative flex-shrink-0">
                            <Image
                              src={connector.icon || "/next.svg"}
                              alt={`${connector.name} logo`}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-md object-contain"
                            />
                          </div>
                          <div className="text-left">
                            <span className="font-medium text-gray-700 block">
                              {connector.name}
                            </span>
                            <span className="text-xs text-gray-400 block">
                              {connector.id === "injected" ? "Browser extension" : "Mobile wallet"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-4 text-center text-xs text-gray-400">
                    By connecting, you agree to our Terms of Service
                  </div>
                </div>

                {/* Connection Status Indicators */}
                <AnimatePresence>
                  {connectionStatus !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border-t border-gray-100"
                    >
                      {connectionStatus === "connecting" && (
                        <div className="flex items-center justify-center text-[#0099FF]">
                          <motion.div
                            className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          />
                          <span>Awaiting confirmation in your wallet</span>
                        </div>
                      )}
                      {connectionStatus === "success" && (
                        <div className="flex items-center justify-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Wallet connected successfully!</span>
                        </div>
                      )}
                      {connectionStatus === "error" && (
                        <div className="flex items-center justify-center text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          <span>Connection failed. Please try again.</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="p-4 border-t border-gray-100 text-red-600 text-sm">
                    {error.message}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>,
        document.getElementById("modal-root")!
      )}
    </div>
  );
}