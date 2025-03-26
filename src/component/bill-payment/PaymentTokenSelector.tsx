"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useAccount } from "wagmi";
import { AlertCircle, Coins, Check } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { PaymentToken } from "@/constants/token";
import { usePayment } from "@/hooks/states";
import { debounce } from "@/utils/debounce";
import { formatTokenAmountDisplay } from "@/lib/CP_NGN_USD_Vendor";
import {
  fetchConversionRate,
  convertAmount,
  handleConversionError,
} from "@/utils/conversionUtils";
import ConversionResultCard from "./ConversionResultCard";
import { TokenData } from "@/types/token";

interface PaymentTokenSelectorProps {
  paymentTokens: PaymentToken[];
  selectedToken: string;
  setSelectedToken: (tokenId: string) => void;
  setIsConverting?: (state: boolean) => void;
  setConvertedAmount?: (amount: string) => void;
  setDisplayAmount?: (amount: string) => void;
}

const PaymentTokenSelector: React.FC<PaymentTokenSelectorProps> = ({
  paymentTokens,
  selectedToken,
  setSelectedToken,
  setIsConverting: setParentIsConverting,
  setConvertedAmount: setParentConvertedAmount,
  setDisplayAmount: setParentDisplayAmount,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localDisplayAmount, setLocalDisplayAmount] = useState<string>("0");
  const [isConverting, setIsConverting] = useState(false);
  const { isConnected } = useAccount();
  const [tokenImages, setTokenImages] = useState<{ [key: string]: string }>({});
  const [conversionError, setConversionError] = useState<string | null>(null);
  const payment = usePayment();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [conversionRate, setConversionRate] = useState<string>("");

  // Store previous values to avoid unnecessary calculations
  const prevAmountRef = useRef<string>("");
  const prevTokenRef = useRef<string>("");
  const lastCalculationTimeRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTokenData = paymentTokens.find(
    (token) => token.id === selectedToken
  ) as PaymentToken | undefined;

  // Ensure selectedTokenData is of type TokenData
  const tokenData: TokenData | undefined = selectedTokenData
    ? {
        id: selectedTokenData.id,
        network: selectedTokenData.network,
        token: selectedTokenData.token,
        address: selectedTokenData.address,
        icon: selectedTokenData.icon,
        symbol: selectedTokenData.symbol,
      }
    : undefined;

  const creditAmount = watch("amount");

  const toggleDropdown = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeDropdown = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
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

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await fetchConversionRate();
      setConversionRate(rate);
    };
    fetchRate();
  }, []);

  const legacyUpdateAmount = async (amount: string, token: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (amount === prevAmountRef.current && token === prevTokenRef.current) {
      return;
    }

    setConversionError(null);

    debounceTimerRef.current = setTimeout(async () => {
      if (selectedTokenData && amount && !isNaN(Number(amount))) {
        try {
          prevAmountRef.current = amount;
          prevTokenRef.current = token;
          lastCalculationTimeRef.current = Date.now();

          setIsConverting(true);
          if (setParentIsConverting) setParentIsConverting(true);

          const formattedAmount = await convertAmount(
            amount,
            selectedTokenData
          );
          setLocalDisplayAmount(formattedAmount);

          if (setParentConvertedAmount)
            setParentConvertedAmount(formattedAmount);
          if (setParentDisplayAmount) setParentDisplayAmount(formattedAmount);
        } catch (error) {
          console.error("Error converting amount:", error);
          setConversionError("Network error. Using estimated conversion rate.");

          const formattedAmount = handleConversionError(amount);
          setLocalDisplayAmount(formattedAmount);

          if (setParentConvertedAmount)
            setParentConvertedAmount(formattedAmount);
          if (setParentDisplayAmount) setParentDisplayAmount(formattedAmount);
        } finally {
          setIsConverting(false);
          if (setParentIsConverting) setParentIsConverting(false);
        }
      } else {
        setLocalDisplayAmount("0");
        if (setParentConvertedAmount) setParentConvertedAmount("0");
        if (setParentDisplayAmount) setParentDisplayAmount("0");
      }
    }, 800);
  };

  useEffect(() => {
    legacyUpdateAmount(creditAmount, selectedToken);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [creditAmount, selectedToken]);

  const handleTokenSelect = (token: PaymentToken) => {
    setSelectedToken(token.id);
    setIsModalOpen(false);
  };

  const getTokenImageSource = (network: string, token: string) => {
    const key = `${network.toLowerCase()}-${token.toLowerCase()}`;
    return tokenImages[key] || "/network-icons/default-token.png";
  };

  const updateConversionAmount = async () => {
    try {
      setConversionError(null);

      if (payment.amount) {
        const approxUsdValue = parseFloat(payment.amount) / 1400;
        const formattedValue = formatTokenAmountDisplay(
          approxUsdValue.toString()
        );
        setLocalDisplayAmount(formattedValue);
      }
    } catch (error) {
      console.error("Failed to calculate conversion rate:", error);
      setConversionError("Could not calculate rate");

      if (payment.amount) {
        const approxUsdValue = parseFloat(payment.amount) / 1400;
        const formattedValue = formatTokenAmountDisplay(
          approxUsdValue.toString()
        );
        setLocalDisplayAmount(formattedValue);
      }
    }
  };

  const debouncedUpdateAmount = useRef(
    debounce(updateConversionAmount, 500)
  ).current;

  useEffect(() => {
    if (payment.amount && payment.amount !== "0") {
      debouncedUpdateAmount();
    }
  }, [payment.amount]);

  return (
    <div className="max-w-md mx-auto ">
      <div className="bg-[#F1F5F9] rounded-xl p-2">
        <motion.div
          className="bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E2E8F0]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Card Content */}
          <div className="p-5 space-y-4">
            {/* Amount and Token Selection */}
            <div className="space-y-3">
              <div className="flex flex-row items-stretch gap-3">
                {/* Amount Input */}
                <div className="flex-1 relative">
                  <label
                    htmlFor="amount"
                    className="block text-xs font-bold text-[#1E293B] mb-2 ml-0.5"
                  >
                    Amount (min. 50)
                  </label>
                  <div className="relative">
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
                      className="w-full h-10 px-3 pr-[110px] text-sm font-medium rounded-lg transition-all duration-200 ease-in-out border border-[#E2E8F0] hover:border-[#A1A1AA] focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/30 placeholder:text-[#A1A1AA] text-[#1E293B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#1E293B] font-medium px-2 py-1 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-sm">
                      Credit Units
                    </div>
                  </div>
                </div>

                {/* Token Selection */}
                <div className="relative" ref={dropdownRef}>
                  <label
                    htmlFor="tokenSelect"
                    className="block text-xs font-bold text-[#1E293B] mb-2 ml-0.5"
                  >
                    Payment Token
                  </label>
                  <motion.button
                    id="tokenSelect"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown();
                    }}
                    disabled={!isConnected}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between gap-2 whitespace-nowrap transition-all duration-200 h-10 px-3 rounded-lg border border-[#E2E8F0] shadow-sm w-full sm:w-auto min-w-[70px] ${
                      isConnected
                        ? "hover:border-[#A1A1AA] focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/30"
                        : "cursor-not-allowed bg-[#F1F5F9] opacity-50 border-[#E2E8F0]"
                    }`}
                    data-action="token-select"
                  >
                    {isConnected ? (
                      selectedTokenData ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#E2E8F0]">
                              <Image
                                src={
                                  selectedTokenData?.icon || "/placeholder.svg"
                                }
                                alt={selectedTokenData?.symbol}
                                width={24}
                                height={24}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-[#1E293B]">
                              {selectedTokenData.symbol}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-[#1E293B]">
                            Select token
                          </span>
                        </>
                      )
                    ) : (
                      <span className="text-sm font-medium text-[#A1A1AA]">
                        Connect Wallet
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {errors.amount && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="px-3 py-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] shadow-sm"
                  >
                    <p className="text-sm text-[#DC2626] flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {errors.amount?.message?.toString()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Conversion Result */}
      {tokenData ? (
        <ConversionResultCard
          selectedTokenData={tokenData}
          creditAmount={creditAmount}
          localDisplayAmount={localDisplayAmount}
          conversionRate={conversionRate}
          isConverting={isConverting}
          conversionError={conversionError}
        />
      ) : (
        ""
      )}

      {/* Token Selection Modal */}
      <AnimatePresence>
        {isModalOpen && isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            data-action="token-select"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#FFFFFF] rounded-xl w-full max-w-[90vw] sm:max-w-md shadow-xl border border-[#E2E8F0] overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
              }}
              data-action="token-select"
            >
              <div className="p-4 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#1E293B] flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#60A5FA]" />
                    Select a Token
                  </h2>
                  <motion.button
                    data-action="token-select"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full hover:bg-[#F1F5F9] transition-colors text-[#60A5FA]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="p-3 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
                <div className="space-y-1.5">
                  {paymentTokens.map((token: PaymentToken) => (
                    <motion.div
                      key={token.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTokenSelect(token);
                      }}
                      data-action="token-select"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                        selectedToken === token.id
                          ? "bg-[#E0F2FE] border border-[#60A5FA]/50"
                          : "hover:bg-[#F1F5F9] border border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E2E8F0]">
                        <Image
                          src={
                            getTokenImageSource(token.network, token.token) ||
                            "/placeholder.svg"
                          }
                          alt={`${token.token} on ${token.network}`}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-semibold text-[#1E293B] truncate">
                          {token.token}
                        </span>
                        <span className="text-xs text-[#A1A1AA] truncate">
                          {token.network}
                        </span>
                      </div>

                      {selectedToken === token.id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-[#60A5FA] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#FFFFFF]" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentTokenSelector;