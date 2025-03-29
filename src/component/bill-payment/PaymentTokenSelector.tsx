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
    <div className="max-w-md mx-auto">
      <div className="flex flex-col gap-2 bg-background-light rounded-lg p-3 border border-border-light">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-row justify-between items-center gap-3">
            {/* Amount Input */}
            <div className="relative w-2/3">
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
                className="w-full text-lg font-medium bg-transparent outline-none text-text-primary placeholder:text-text-muted [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              {creditAmount && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-text-muted font-medium px-2 py-1 bg-background-light rounded-md border border-border-light">
                  Credit
                </div>
              )}
            </div>

            {/* Token Selection Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!isConnected}
                className={`bg-white rounded-lg py-1.5 px-3 flex items-center gap-2 w-fit cursor-pointer border border-border-light hover:border-border-medium transition-colors duration-200 ${
                  isConnected ? "" : "cursor-not-allowed opacity-50"
                }`}
              >
                {isConnected ? (
                  selectedTokenData ? (
                    <>
                      <div className="inline-flex items-center justify-center overflow-hidden w-3.5 h-3.5 min-w-3.5">
                        <Image
                          src={selectedTokenData?.icon || "/placeholder.svg"}
                          alt={selectedTokenData?.symbol}
                          width={14}
                          height={14}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="font-medium text-sm text-text-primary">
                        {selectedTokenData.symbol}
                      </span>
                      <ChevronDown className="w-4 h-4 text-brand-primary" />
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center overflow-hidden w-3.5 h-3.5 min-w-3.5">
                        <Image
                          src={"/placeholder.svg"}
                          alt=""
                          width={14}
                          height={14}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="font-medium text-sm text-text-primary">
                        Select
                      </span>
                      <ChevronDown className="w-4 h-4 text-brand-primary" />
                    </>
                  )
                ) : (
                  <span className="font-medium text-sm text-text-muted whitespace-nowrap">
                    Connect Wallet
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex items-center text-xs font-medium w-2/3">
              <Coins className="text-brand-primary w-3.5 h-3.5 pointer-events-none" />
              <span className="text-text-primary ml-1.5">Amount</span>
            </div>

            <div className="flex items-center justify-end text-xs font-medium w-1/3">
              <span className="text-text-primary ml-auto">
                Payment Token
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.amount && (
          <div className="px-2.5 py-1.5 mt-1 rounded-md bg-status-error/5 border border-status-error/10">
            <p className="text-xs text-status-error flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.amount?.message?.toString()}
            </p>
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
                    aria-label="Close token selection modal"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-6 border-b border-border-light">
                    <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                      <Coins className="w-5 h-5 text-brand-primary" />
                      Select Payment Token
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      Choose your preferred token for payment
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {paymentTokens.map((token: PaymentToken) => (
                        <motion.button
                          key={token.id}
                          onClick={() => handleTokenSelect(token)}
                          className={`w-full p-3 flex items-center justify-between rounded-lg transition-colors ${
                            selectedToken === token.id
                              ? "bg-brand-primary/10 border border-brand-primary"
                              : "hover:bg-background-light border border-border-light"
                          }`}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative flex-shrink-0 rounded-lg overflow-hidden border border-border-light">
                              <Image
                                src={getTokenImageSource(
                                  token.network,
                                  token.token
                                )}
                                alt={`${token.token} on ${token.network}`}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-left">
                              <span
                                className={`font-medium block ${
                                  selectedToken === token.id
                                    ? "text-brand-primary"
                                    : "text-text-primary"
                                }`}
                              >
                                {token.token}
                              </span>
                              <span className="text-xs text-text-muted">
                                {token.network}
                              </span>
                            </div>
                          </div>
                          {selectedToken === token.id && (
                            <Check className="w-5 h-5 text-brand-primary" />
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
