"use client";

import { useState, useEffect, useRef } from "react";
import { useConnect, Connector, useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronRight, CheckCircle, XCircle, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Account } from "./account";
import { useWalletModal } from "@/context/WalletModalContext";

interface WalletOptionsProps {
  variant?: "mini" | "full";
}

export function WalletButton({ variant = "mini" }: WalletOptionsProps) {
  const { isConnected } = useAccount();
  const { isPending } = useConnect();
  const { connectionStatus } = useWalletModal();
  const isConnecting = isPending || connectionStatus === "connecting";

  return (
    <>
      {isConnected ? (
        <Account />
      ) : (
        <WalletOptions 
          variant={variant}
          isConnecting={isConnecting}
        />
      )}
    </>
  );
}

export function WalletOptions({ 
  variant = "mini",
  isConnecting: parentIsConnecting
}: WalletOptionsProps & { isConnecting?: boolean }) {
  const { connectors, connect, error, isPending } = useConnect();
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { 
    isModalOpen, 
    setIsModalOpen, 
    connectionStatus, 
    setConnectionStatus,
    selectedConnector,
    setSelectedConnector
  } = useWalletModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      return;
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, setIsModalOpen]);

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
  }, [isPending, error, selectedConnector, connectionStatus, setConnectionStatus, setIsModalOpen, setSelectedConnector]);

  const handleConnect = async (connector: Connector) => {
    setSelectedConnector(connector.uid);
    setConnectionStatus("connecting");

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Connection timed out")), 10000)
    );

    try {
      await Promise.race([connect({ connector }), timeout]);
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

  // Use parent's connecting state if provided, otherwise use local state
  const isConnecting = parentIsConnecting ?? (isPending || connectionStatus === "connecting");

  return (
    <div className={`relative ${variant === "full" ? "w-full" : "inline-block"}`}>
      {/* Connect Wallet Button with clear CTA */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting || !isClient}
        className={`flex items-center justify-center gap-2 transition-all duration-300 font-medium ${
          variant === "mini"
            ? "text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark hover:from-chainpay-blue-dark hover:to-[#3B82F6] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#3B82F6]/20 focus:outline-none dark:from-chainpay-blue-dark dark:to-chainpay-blue-dark/90 dark:hover:from-chainpay-blue-dark/90 dark:hover:to-[#3B82F6] dark:hover:shadow-[#3B82F6]/20 text-white"
            : "text-base px-4 py-2.5 rounded-lg w-full bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark hover:from-chainpay-blue-dark hover:to-[#3B82F6] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#3B82F6]/20 focus:outline-none dark:from-chainpay-blue-dark dark:to-chainpay-blue-dark/90 dark:hover:from-chainpay-blue-dark/90 dark:hover:to-[#3B82F6] dark:hover:shadow-[#3B82F6]/20 text-white"
        } ${
          isConnecting || !isClient
            ? "opacity-50 cursor-not-allowed bg-background-light/50 dark:bg-background-dark-light/50 text-text-muted dark:text-text-dark-muted" 
            : ""
        }`}
        aria-label="Connect your wallet to continue"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
            <span className="font-bold">
              {variant === "mini" ? "Connect" : "Connect Wallet"}
            </span>
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
              className="fixed inset-0 bg-background-overlay dark:bg-background-dark/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-md bg-white dark:bg-background-dark-card shadow-xl rounded-lg overflow-hidden relative"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-text-muted dark:text-text-dark-muted hover:text-text-primary dark:hover:text-text-dark-primary p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark-light transition-colors"
                  aria-label="Close wallet connection modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-brand-primary" />
                    Welcome to ChainPay
                  </h2>
                  <p className="text-sm text-text-muted dark:text-text-dark-muted mt-1">
                    Let's connect your wallet to start your secure blockchain journey
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
                            ? "bg-brand-primary/10 dark:bg-brand-primary/20"
                            : "hover:bg-background-light dark:hover:bg-background-dark-light"
                        } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
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
                                : "text-text-primary dark:text-text-dark-primary"
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
                    Your security is our priority. By connecting, you agree to our Terms of Service
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
                      className="p-4 bg-background-light dark:bg-background-dark-light"
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
                          <span>Waiting for your wallet confirmation...</span>
                        </div>
                      )}
                      {connectionStatus === "success" && (
                        <div className="flex items-center justify-center text-status-success">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Perfect! Your wallet is now securely connected</span>
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
                  <div className="p-4 bg-status-error/5 text-status-error text-sm">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>{error.message}</span>
                    </div>
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