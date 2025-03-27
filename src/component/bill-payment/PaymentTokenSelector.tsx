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
      <div className="flex flex-col gap-2 bg-chainpay-blue-light/15 rounded-lg p-3 border border-chainpay-blue-light/20">
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
                className="w-full text-lg font-medium bg-transparent outline-none text-chainpay-blue-dark placeholder:text-chainpay-blue-dark/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              {creditAmount && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-chainpay-blue-dark/70 font-medium px-2 py-1 bg-chainpay-blue-light/5 rounded-md border border-chainpay-blue-light/20">
                  Units
                </div>
              )}
            </div>

            {/* Token Selection Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!isConnected}
                className={`bg-white rounded-lg py-1.5 px-3 flex items-center gap-2 w-fit cursor-pointer border border-chainpay-blue-light/20 hover:border-chainpay-blue-light/50 transition-colors duration-200 ${
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
                      <span className="font-medium text-sm text-chainpay-blue-dark">
                        {selectedTokenData.symbol}
                      </span>
                      <ChevronDown className="w-4 h-4 text-chainpay-blue" />
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
                      <span className="font-medium text-sm text-chainpay-blue-dark">
                        Select
                      </span>
                      <ChevronDown className="w-4 h-4 text-chainpay-blue" />
                    </>
                  )
                ) : (
                  <span className="font-medium text-sm text-chainpay-blue-dark/50">
                    Connect Wallet
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex items-center text-xs font-medium w-2/3">
              <Coins className="text-chainpay-orange w-3.5 h-3.5 pointer-events-none" />
              <span className="text-chainpay-blue-dark ml-1.5">Payment Amount</span>
            </div>

            <div className="flex items-center justify-end text-xs font-medium w-1/3">
              <span className="text-chainpay-blue-dark ml-auto">Payment Token</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.amount && (
          <div className="px-2.5 py-1.5 mt-1 rounded-md bg-red-50 border border-red-200">
            <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.amount?.message?.toString()}
            </p>
          </div>
        )}
      </div>

      {/* Token Selection Modal */}
      {isModalOpen && isClient && createPortal(
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
                  aria-label="Close token selection modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-chainpay-orange" />
                    Select Payment Token
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
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
                            ? "bg-chainpay-blue/10 border border-chainpay-blue"
                            : "hover:bg-gray-50 border border-gray-100"
                        }`}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={getTokenImageSource(token.network, token.token)}
                              alt={`${token.token} on ${token.network}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-left">
                            <span className={`font-medium block ${
                              selectedToken === token.id 
                                ? "text-chainpay-blue" 
                                : "text-gray-700"
                            }`}>
                              {token.token}
                            </span>
                            <span className="text-xs text-gray-500">
                              {token.network}
                            </span>
                          </div>
                        </div>
                        {selectedToken === token.id && (
                          <Check className="w-5 h-5 text-chainpay-blue" />
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
