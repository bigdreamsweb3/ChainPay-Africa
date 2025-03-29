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
    setIsModalOpen(false);

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Connection timed out")), 10000) // 10 seconds timeout
    );

    try {
      await Promise.race([connect({ connector }), timeout]); // Race between connect and timeout
      setConnectionStatus("success");
    } catch (err) {
      console.error("Connection error:", err);
      setConnectionStatus("error");
    }
  };

  // Filter out the Injected connector
  const filteredConnectors = connectors.filter(connector => 
    connector.name.toLowerCase() !== "injected"
  );

  return (
    <div className="relative">
      {/* Connect Wallet Button with clear CTA */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending || !isClient}
        className={`flex items-center space-x-2 hover:opacity-90 active:scale-95 px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 text-sm font-medium ${
          isPending || !isClient ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white"
        }`}
        aria-label="Connect your wallet to continue"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : !isClient ? (
          <>
            <Wallet className="w-4 h-4" />
            <span>Loading wallet options...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect</span>
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
              className="fixed inset-0 bg-background-overlay backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1 rounded-full hover:bg-background-light transition-colors"
                  aria-label="Close wallet connection modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-border-light">
                  <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-brand-primary" />
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    Select your preferred wallet provider to continue
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {filteredConnectors.map((connector) => (
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
                            ? "bg-brand-primary/10 border border-brand-primary"
                            : "hover:bg-background-light border border-border-light"
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
                            <span className={`font-medium ${
                              selectedConnector === connector.uid
                                ? "text-brand-primary"
                                : "text-text-primary"
                            }`}>
                              {connector.name}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${
                          selectedConnector === connector.uid
                            ? "text-brand-primary"
                            : "text-text-muted"
                        }`} />
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-4 text-center text-xs text-text-muted">
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
                      className="p-4 border-t border-border-light"
                    >
                      {connectionStatus === "connecting" && (
                        <div className="flex items-center justify-center text-brand-primary">
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
                        <div className="flex items-center justify-center text-status-success">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Wallet connected successfully!</span>
                        </div>
                      )}
                      {connectionStatus === "error" && (
                        <div className="flex items-center justify-center text-status-error">
                          <XCircle className="w-4 h-4 mr-2" />
                          <span>Connection failed. Please try again.</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="p-4 border-t border-border-light bg-status-error/5 text-status-error text-sm">
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