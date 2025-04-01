"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useAccount } from "wagmi";
import { AlertCircle, Coins, Check, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import type { PaymentToken } from "@/constants/token";

interface PaymentTokenSelectorProps {
  paymentTokens: PaymentToken[];
  selectedToken: string;
  setSelectedToken: (tokenId: string) => void;
}

const PaymentTokenSelector: React.FC<PaymentTokenSelectorProps> = ({
  paymentTokens,
  selectedToken,
  setSelectedToken,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount();
  const [tokenImages, setTokenImages] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const selectedTokenData = paymentTokens.find(
    (token) => token.id === selectedToken
  ) as PaymentToken | undefined;

  const creditAmount = watch("amount");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTokenIcons = async () => {
      try {
        const tokenIconMap: { [key: string]: string } = {
          "ethereum-usdt": "/network-icons/ethereum-usdt.png",
          "ethereum-usdc": "/network-icons/ethereum-usdc.png",
          "polygon-usdt": "/network-icons/polygon-usdt.png",
          "polygon-usdc": "/network-icons/polygon-usdc.png",
          "binance-usdt": "/network-icons/binance-usdt.png",
          "binance-usdc": "/network-icons/binance-usdc.png",
          "arbitrum-usdt": "/network-icons/arbitrum-usdt.png",
          "arbitrum-usdc": "/network-icons/arbitrum-usdc.png",
          "optimism-usdt": "/network-icons/optimism-usdt.png",
          "optimism-usdc": "/network-icons/optimism-usdc.png",
          "base-usdt": "/network-icons/base-usdt.png",
          "base-usdc": "/network-icons/base-usdc.png",
        };

        setTokenImages(tokenIconMap);
      } catch (error) {
        console.error("Error fetching token icons:", error);
      }
    };

    fetchTokenIcons();
  }, []);

  const handleTokenSelect = (token: PaymentToken) => {
    setSelectedToken(token.id);
    setIsModalOpen(false);
  };

  const getTokenImageSource = (network: string, token: string) => {
    const key = `${network.toLowerCase()}-${token.toLowerCase()}`;
    return tokenImages[key] || "/network-icons/default-token.png";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 bg-background-light dark:bg-background-dark rounded-lg p-4 transition-colors duration-300">
        <div className="flex flex-col space-y-3">
          {/* Input Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Amount Input */}
            <div className="flex-1 min-w-0 relative">
              <input
                id="amount"
                type="number"
                step="1"
                min="50"
                placeholder="Enter amount"
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 50,
                    message: "Minimum amount is 50 credit units",
                  },
                  validate: (value) =>
                    !isNaN(Number(value)) || "Amount must be a number",
                })}
                className="w-full text-base font-medium bg-transparent outline-none text-text-primary dark:text-text-light placeholder:text-text-muted dark:placeholder:text-text-muted/70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors duration-200"
              />

              {creditAmount && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-text-muted font-medium px-2 py-1 bg-white dark:bg-background-dark rounded-md transition-colors duration-200">
                    Credit
                  </span>
                </div>
              )}
            </div>

            {/* Token Selection */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!isConnected}
                className={`bg-white dark:bg-background-dark-card rounded-lg py-2 px-3 flex items-center gap-2 min-w-[100px] hover:bg-gray-50 dark:hover:bg-background-dark-medium transition-colors duration-200 ${
                  isConnected ? "" : "cursor-not-allowed opacity-50"
                }`}
              >
                {isConnected ? (
                  selectedTokenData ? (
                    <>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <Image
                          src={selectedTokenData?.icon || "/placeholder.svg"}
                          alt={selectedTokenData?.symbol}
                          width={16}
                          height={16}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium text-sm text-text-primary dark:text-text-light truncate">
                        {selectedTokenData.symbol}
                      </span>
                      <ChevronDown className="w-4 h-4 text-brand-primary shrink-0" />
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <Image
                          src="/placeholder.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium text-sm text-text-primary dark:text-text-light truncate">
                        Select
                      </span>
                      <ChevronDown className="w-4 h-4 text-brand-primary shrink-0" />
                    </>
                  )
                ) : (
                  <span className="font-medium text-sm text-text-muted dark:text-text-muted/70 whitespace-nowrap">
                    Connect Wallet
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Labels Row */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center text-text-primary dark:text-text-light">
              <Coins className="w-3.5 h-3.5 text-brand-primary" />
              <span className="ml-1.5 whitespace-nowrap">Amount</span>
            </div>
            <div className="text-text-primary dark:text-text-light whitespace-nowrap">
              Payment Token
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.amount && (
          <div className="px-3 py-2 rounded-md bg-status-error/5 dark:bg-status-error/10 text-status-error text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{errors.amount?.message?.toString()}</span>
          </div>
        )}
      </div>

      {/* Token Selection Modal */}
      {isModalOpen &&
        isClient &&
        createPortal(
          <div className="fixed inset-0 z-[50] pointer-events-auto">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-background-overlay dark:bg-background-overlay/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full max-w-md bg-white dark:bg-background-dark shadow-lg dark:shadow-xl dark:shadow-background-dark/20 rounded-lg overflow-hidden relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-text-muted dark:text-text-muted/70 hover:text-text-primary dark:hover:text-text-light p-1 rounded-full hover:bg-gray-50 dark:hover:bg-background-dark-medium transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-6 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold text-text-primary dark:text-text-light flex items-center gap-2">
                      <Coins className="w-5 h-5 text-brand-primary" />
                      Select Payment Token
                    </h2>
                    <p className="text-sm text-text-muted dark:text-text-muted/70 mt-1">
                      Choose your preferred token for payment
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2">
                      {paymentTokens.map((token: PaymentToken) => (
                        <motion.button
                          key={token.id}
                          onClick={() => handleTokenSelect(token)}
                          className={`w-full p-3 flex items-center justify-between rounded-lg transition-colors ${
                            selectedToken === token.id
                              ? "bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary"
                              : "hover:bg-gray-50 dark:hover:bg-background-dark-medium text-text-primary dark:text-text-light"
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-background-dark-medium">
                              <Image
                                src={getTokenImageSource(token.network, token.token)}
                                alt={`${token.token} on ${token.network}`}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-left">
                              <span className="font-medium block">
                                {token.token}
                              </span>
                              <span className="text-xs text-text-muted dark:text-text-muted/70">
                                {token.network}
                              </span>
                            </div>
                          </div>
                          {selectedToken === token.id && (
                            <Check className="w-5 h-5 shrink-0" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>,
          document.getElementById("modal-root")!
        )}
    </div>
  );
};

export default PaymentTokenSelector;
