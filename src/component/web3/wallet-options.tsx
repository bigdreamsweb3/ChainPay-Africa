"use client";

import { useState, useEffect } from "react";
import { useConnect, Connector } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronRight, CheckCircle, XCircle, X } from "lucide-react";
import Image from "next/image";

export function WalletOptions() {
  const { connectors, connect, error, isPending } = useConnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<string | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "success" | "error"
  >("idle");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async (connector: Connector) => {
    setSelectedConnector(connector.uid);
    setConnectionStatus("connecting");
    try {
      connect({ connector });
      setConnectionStatus("success");
      setTimeout(() => {
        setIsModalOpen(false);
        setConnectionStatus("idle");
      }, 1500);
    } catch (err) {
      console.error("Connection error:", err);
      setConnectionStatus("error");
    }
  };

  if (!isClient) {
    return (
      <button className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400">
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 ${
            isPending
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white hover:opacity-90 active:scale-95"
          }`}
      >
        <div className="flex items-center gap-2">
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-400 rounded-full animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#0099FF]" />
                  Connect Wallet
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {connectors.map((connector) => (
                    <motion.button
                      key={connector.uid}
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                      className={`w-full p-3 flex items-center justify-between rounded-lg transition-colors ${
                        selectedConnector === connector.uid
                          ? "bg-[#0099FF]/5 border border-[#0099FF]"
                          : "hover:bg-gray-50 border border-gray-100"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={connector.icon || "/next.svg"}
                          alt={`${connector.name} logo`}
                          width={32}
                          height={32}
                          className="w-6 h-6 rounded-md"
                        />
                        <span className="font-medium text-gray-700">
                          {connector.name}
                          {isPending &&
                            selectedConnector === connector.uid &&
                            " (Connecting...)"}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {connectionStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 border-t border-gray-100"
                  >
                    {connectionStatus === "connecting" && (
                      <div className="flex items-center text-[#0099FF]">
                        <motion.div
                          className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                        Connecting...
                      </div>
                    )}
                    {connectionStatus === "success" && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connected successfully
                      </div>
                    )}
                    {connectionStatus === "error" && (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-4 h-4 mr-2" />
                        Connection failed
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
        )}
      </AnimatePresence>
    </>
  );
}
