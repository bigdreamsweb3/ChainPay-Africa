"use client";

import { useEffect, useRef, useState } from "react";
import { useConnect, Connector } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, XCircle, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useWalletModal } from "@/context/WalletModalContext";
import { getWalletIcon } from "@/app-config";

// Function to sanitize error messages
const getFriendlyErrorMessage = (error: Error | null) => {
  if (!error) return "";
  const message = error.message.toLowerCase();
  if (message.includes("user rejected") || message.includes("rejected the request")) {
    return "Connection rejected by user.";
  } else if (message.includes("timeout")) {
    return "Connection timed out. Please try again.";
  } else {
    return "An error occurred. Please try again.";
  }
};

export function WalletOptionsModal() {
  const { connectors, connect, error, isPending } = useConnect();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const {
    isModalOpen,
    setIsModalOpen,
    connectionStatus,
    setConnectionStatus,
    selectedConnector,
    setSelectedConnector,
  } = useWalletModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close our modal when WalletConnect modal is showing
  useEffect(() => {
    if (isPending) {
      setIsModalOpen(false);
    }
  }, [isPending, setIsModalOpen]);

  useEffect(() => {
    if (!selectedConnector) return;

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
  }, [
    isPending,
    error,
    selectedConnector,
    connectionStatus,
    setConnectionStatus,
    setIsModalOpen,
    setSelectedConnector,
  ]);

  const handleConnect = async (connector: Connector) => {
    // Close our modal before connecting
    setIsModalOpen(false);
    setSelectedConnector(connector.uid);
    setConnectionStatus("connecting");

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Connection timed out")), 10000)
    );

    try {
      await Promise.race([connect({ connector }), timeoutPromise]);
      setConnectionStatus("success");
    } catch (err) {
      console.error("Connection error:", err instanceof Error ? err.message : String(err));
      setConnectionStatus("error");
    }
  };

  // Filter connectors, excluding generic "injected" named connectors and Safe wallet
  const filteredConnectors = connectors.filter(
    (connector) => 
      connector.name.toLowerCase() !== "injected" && 
      connector.name.toLowerCase() !== "safe" &&
      !connector.name.toLowerCase().includes("safe")
  );

  if (!isMounted || isPending) {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    return null;
  }

  return (
    <>
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 pointer-events-auto">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-background-overlay dark:bg-background-dark/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full max-w-md bg-white dark:bg-background-dark-card shadow-xl rounded-lg overflow-hidden relative pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-1 text-text-muted dark:text-text-dark-muted hover:text-text-primary dark:hover:text-text-dark-primary rounded-full hover:bg-background-light dark:hover:bg-background-dark-light transition-colors"
                    aria-label="Close wallet connection modal"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                      <span className="w-5 h-5 text-brand-primary">🔗</span>
                      Welcome to ChainPay
                    </h2>
                    <p className="mt-1 text-sm text-text-muted dark:text-text-dark-muted">
                      Connect your wallet to start your blockchain journey
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {filteredConnectors.map((connector) => (
                      <motion.button
                        key={connector.uid}
                        onClick={() => handleConnect(connector)}
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
                              src={getWalletIcon(connector)?.trim() || "/default-wallet-icon.svg"}
                              alt={`${connector.name} logo`}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-md object-contain"
                              onError={(e) =>
                                (e.currentTarget.src = "/default-wallet-icon.svg")
                              }
                            />
                          </div>
                          <span
                            className={`font-medium ${
                              selectedConnector === connector.uid
                                ? "text-brand-primary"
                                : "text-text-primary dark:text-text-dark-primary"
                            }`}
                          >
                            {connector.name}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 ${
                            selectedConnector === connector.uid
                              ? "text-brand-primary"
                              : "text-text-muted"
                          }`}
                        />
                      </motion.button>
                    ))}
                    <div className="mt-4 text-center text-xs text-text-muted">
                      By connecting, you agree to our Terms of Service
                    </div>
                  </div>

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
                          <div className="flex items-center justify-center gap-2 text-brand-primary">
                            <motion.div
                              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span>Waiting for confirmation...</span>
                          </div>
                        )}
                        {connectionStatus === "success" && (
                          <div className="flex items-center justify-center gap-2 text-status-success">
                            <CheckCircle className="w-4 h-4" />
                            <span>Wallet connected successfully</span>
                          </div>
                        )}
                        {connectionStatus === "error" && (
                          <div className="flex items-center justify-center gap-2 text-status-error">
                            <XCircle className="w-4 h-4" />
                            <span>{getFriendlyErrorMessage(error)}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && connectionStatus === "error" && (
                    <div className="p-4 bg-status-error/5 text-status-error text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        <span>{getFriendlyErrorMessage(error)}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>,
          modalRoot
        )}
    </>
  );
}