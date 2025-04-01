"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useAccount, useSwitchChain } from "wagmi";
import { AlertCircle, Coins, Check, ChevronDown, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import type { PaymentToken } from "@/constants/token";
import { baseSepolia, monadTestnet } from "@/utils/web3/chains";

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
  const { isConnected, chain } = useAccount();
  const { switchChain, status: switchStatus } = useSwitchChain();
  const [tokenImages, setTokenImages] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const selectedTokenData = paymentTokens.find(
    (token) => token.id === selectedToken
  ) as PaymentToken | undefined;

  const creditAmount = watch("amount");

  // Get networks with accepted tokens
  const networksWithTokens = [
    {
      chain: baseSepolia,
      tokens: Object.values(baseSepolia.payAcceptedTokens),
    },
    {
      chain: monadTestnet,
      tokens: Object.values(monadTestnet.payAcceptedTokens),
    },
  ];

  // Check if current network has accepted tokens
  const currentNetworkHasTokens = networksWithTokens.some(
    (network) => network.chain.id === chain?.id
  );

  // Get current network's tokens
  const currentNetworkTokens = useMemo(() => 
    networksWithTokens.find(
      (network) => network.chain.id === chain?.id
    )?.tokens || []
  , [chain?.id, networksWithTokens]);

  // Auto-select first token when network changes or when no token is selected
  useEffect(() => {
    if (currentNetworkHasTokens && (!selectedToken || !currentNetworkTokens.some(token => token.id === selectedToken))) {
      const firstToken = currentNetworkTokens[0];
      if (firstToken) {
        setSelectedToken(firstToken.id);
      }
    }
  }, [chain?.id, currentNetworkHasTokens, currentNetworkTokens, selectedToken, setSelectedToken]);

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchChain({ chainId: chainId as 1 | 84532 | 10143 });
      // Don't close modal immediately to allow user to see the new tokens
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTokenIcons = async () => {
      try {
        const tokenIconMap: { [key: string]: string } = {};
        
        // Add icons from Base Sepolia
        Object.values(baseSepolia.payAcceptedTokens).forEach(token => {
          if (token.icon) {
            tokenIconMap[`${token.network.toLowerCase()}-${token.token.toLowerCase()}`] = token.icon;
          }
        });

        // Add icons from Monad Testnet
        Object.values(monadTestnet.payAcceptedTokens).forEach(token => {
          if (token.icon) {
            tokenIconMap[`${token.network.toLowerCase()}-${token.token.toLowerCase()}`] = token.icon;
          }
        });

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
                  className="w-full max-w-md bg-white dark:bg-background-dark shadow-xl rounded-lg overflow-hidden relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-text-muted dark:text-text-muted/70 hover:text-text-primary dark:hover:text-text-light p-1 rounded-full hover:bg-gray-50 dark:hover:bg-background-dark-medium transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-6 bg-background-light dark:bg-background-dark-light">
                    <h2 className="text-xl font-semibold text-text-primary dark:text-text-light flex items-center gap-2">
                      <Coins className="w-5 h-5 text-brand-primary" />
                      Select Payment Token
                    </h2>
                    <p className="text-sm text-text-muted dark:text-text-muted/70 mt-1">
                      Choose your preferred token for payment
                    </p>
                  </div>

                  <div className="p-4">
                    {!currentNetworkHasTokens ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-status-warning/5 dark:bg-status-warning/10 rounded-lg">
                          <p className="text-sm text-status-warning">
                            Your current network doesn&apos;t support any payment tokens. Please switch to a supported network.
                          </p>
                        </div>
                        <div className="space-y-2">
                          {networksWithTokens.map((network) => (
                            <motion.button
                              key={network.chain.id}
                              onClick={() => handleNetworkSwitch(network.chain.id)}
                              disabled={switchStatus === "pending"}
                              className={`w-full p-3 flex items-center justify-between rounded-lg transition-colors ${
                                switchStatus === "pending"
                                  ? "bg-background-light dark:bg-background-dark-light cursor-not-allowed opacity-50"
                                  : "hover:bg-background-light dark:hover:bg-background-dark-light"
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-background-dark-medium">
                                  <Image
                                    src={network.chain.icon}
                                    alt={network.chain.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="text-left">
                                  <span className="font-medium text-text-primary dark:text-text-light block">
                                    {network.chain.name}
                                  </span>
                                  <span className="text-xs text-text-muted dark:text-text-muted/70">
                                    {network.tokens.length} tokens available
                                  </span>
                                </div>
                              </div>
                              {switchStatus === "pending" ? (
                                <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-brand-primary" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentNetworkTokens.map((token: PaymentToken) => (
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
                    )}
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
