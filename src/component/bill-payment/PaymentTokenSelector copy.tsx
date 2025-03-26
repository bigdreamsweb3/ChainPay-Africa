"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useAccount } from "wagmi";
import { AlertCircle, Loader2, CreditCard, Coins, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentToken } from "@/constants/token";
import { usePayment } from "@/hooks/states";
import { debounce } from "@/utils/debounce";
import {
  convertCreditToTokenAmount,
  formatTokenAmountDisplay,
  getConversionRateDisplay,
} from "@/lib/CP_NGN_USD_Vendor";

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

  const prevAmountRef = useRef<string>("");
  const prevTokenRef = useRef<string>("");
  const lastCalculationTimeRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTokenData = paymentTokens.find(
    (token) => token.id === selectedToken
  );

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
    };
    fetchTokenIcons();
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await getConversionRateDisplay();
      setConversionRate(rate);
    };
    fetchRate();
  }, []);

  const legacyUpdateAmount = (amount: string, token: string) => {
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

          const tokenAmount = await convertCreditToTokenAmount(
            Number(amount),
            selectedTokenData
          );

          const formattedAmount = formatTokenAmountDisplay(tokenAmount);
          setLocalDisplayAmount(formattedAmount);

          if (setParentConvertedAmount) setParentConvertedAmount(tokenAmount);
          if (setParentDisplayAmount) setParentDisplayAmount(formattedAmount);
        } catch (error) {
          console.error("Error converting amount:", error);
          setConversionError("Network error. Using estimated conversion rate.");

          const fallbackAmount = (Number(amount) / 1615.142).toFixed(6); // Updated rate
          setLocalDisplayAmount(formatTokenAmountDisplay(fallbackAmount));

          if (setParentConvertedAmount)
            setParentConvertedAmount(fallbackAmount);
          if (setParentDisplayAmount)
            setParentDisplayAmount(formatTokenAmountDisplay(fallbackAmount));
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
        const approxUsdValue = parseFloat(payment.amount) / 1615.142;
        const formattedValue = formatTokenAmountDisplay(
          approxUsdValue.toString()
        );
        setLocalDisplayAmount(formattedValue);
      }
    } catch (error) {
      console.error("Failed to calculate conversion rate:", error);
      setConversionError("Could not calculate rate");
      if (payment.amount) {
        const approxUsdValue = parseFloat(payment.amount) / 1615.142;
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
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Image src="/chainpay-logo.png" alt="ChainPay Logo" width={32} height={32} />
          <span className="text-lg font-bold text-chainpay-blue">ChainPay</span>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Image src="/user-icon.png" alt="User Profile" width={24} height={24} />
        </button>
      </div>

      {/* Payment Type Selection */}
      <div className="flex gap-3 p-5">
        <button
          className="flex-1 h-12 rounded-lg bg-chainpay-blue text-white font-medium flex items-center justify-center gap-2"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Airtime
        </button>
        <button
          className="flex-1 h-12 rounded-lg bg-gray-100 text-gray-600 font-medium flex items-center justify-center gap-2"
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Data
        </button>
        <button
          className="flex-1 h-12 rounded-lg bg-gray-100 text-gray-600 font-medium flex items-center justify-center gap-2"
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Electricity
        </button>
      </div>

      {/* Form Content */}
      <motion.div
        className="bg-white rounded-xl overflow-hidden border border-chainpay-blue-dark/70"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-5 space-y-4">
          {/* Phone Number and Network Provider */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-bold text-chainpay-blue-dark/70 mb-2 ml-0.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="w-full h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                              border border-chainpay-blue-light/40 
                              hover:border-chainpay-blue/60
                              focus:outline-none focus:border-chainpay-blue/70 focus:ring-1 focus:ring-chainpay-blue/30
                              bg-chainpay-blue/5 placeholder:text-chainpay-blue-dark/40 text-chainpay-blue-dark"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phoneNumber.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="networkProvider"
                className="block text-xs font-bold text-chainpay-blue-dark/70 mb-2 ml-0.5"
              >
                Network Provider
              </label>
              <select
                id="networkProvider"
                {...register("networkProvider", {
                  required: "Network provider is required",
                })}
                className="w-full h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                            border border-chainpay-blue-light/40 
                            hover:border-chainpay-blue/60
                            focus:outline-none focus:border-chainpay-blue/70 focus:ring-1 focus:ring-chainpay-blue/30
                            bg-chainpay-blue/5 text-chainpay-blue-dark"
              >
                <option value="mtn">MTN</option>
                <option value="airtel">Airtel</option>
                <option value="glo">Glo</option>
                <option value="9mobile">9mobile</option>
              </select>
              {errors.networkProvider && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.networkProvider.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* Amount and Token Selection */}
          <div className="space-y-3">
            <div className="flex flex-row items-stretch gap-3">
              <div className="flex-1">
                <label
                  htmlFor="amount"
                  className="block text-xs font-bold text-chainpay-blue-dark/70 mb-2 ml-0.5"
                >
                  Amount (min. 50)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="1"
                  min="50"
                  placeholder="Enter amount (Credit Units)"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 50,
                      message: "Minimum amount is 50 credit units",
                    },
                    validate: (value) =>
                      !isNaN(Number(value)) || "Amount must be a number",
                  })}
                  className="w-full h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                              border border-chainpay-blue-light/40 
                              hover:border-chainpay-blue/60
                              focus:outline-none focus:border-chainpay-blue/70 focus:ring-1 focus:ring-chainpay-blue/30
                              bg-chainpay-blue/5 placeholder:text-chainpay-blue-dark/40 text-chainpay-blue-dark
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="relative" ref={dropdownRef}>
                <label
                  htmlFor="tokenSelect"
                  className="block text-xs font-bold text-chainpay-blue-dark/70 mb-2 ml-0.5"
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
                  className={`flex items-center justify-between gap-2 whitespace-nowrap transition-all duration-200 
                              h-10 px-3 pr-4 rounded-lg border shadow-sm w-full sm:w-auto min-w-[70px]
                              ${
                                isConnected
                                  ? "border-chainpay-blue-light/40 hover:border-chainpay-blue/60 bg-chainpay-blue/5 hover:bg-chainpay-blue-light/10"
                                  : "cursor-not-allowed bg-gray-100 opacity-50 border-gray-200"
                              }
                              focus-visible:outline-none focus-visible:border-chainpay-blue/70 focus-visible:ring-1 focus-visible:ring-chainpay-blue/30
                              focus-visible:shadow-[0_0_0_1px_rgba(0,136,204,0.15),0_2px_8px_-2px_rgba(0,136,204,0.15)]`}
                  data-action="token-select"
                >
                  {isConnected ? (
                    selectedTokenData ? (
                      <span className="text-sm font-medium text-chainpay-blue-dark">
                        {selectedTokenData.symbol}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-chainpay-blue">
                        Select token
                      </span>
                    )
                  ) : (
                    <span className="text-sm font-medium text-gray-500">
                      Connect Wallet
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {errors.amount && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 shadow-sm"
                >
                  <p className="text-sm text-red-600 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amount?.message?.toString()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Conversion Result */}
      <AnimatePresence>
        {selectedTokenData &&
          creditAmount &&
          !isNaN(Number(creditAmount)) &&
          Number(creditAmount) >= 50 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-6 mb-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Payment Details
                    </h3>
                    <p className="text-xs text-gray-600">
                      Your payment will be processed in{" "}
                      {selectedTokenData?.symbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Amount to Pay</p>
                    {isConverting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-chainpay-orange" />
                        <span className="text-chainpay-orange-dark font-medium">
                          Calculating...
                        </span>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-gray-900">
                        {localDisplayAmount}{" "}
                        <span className="text-chainpay-orange-dark">
                          {selectedTokenData?.symbol}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
                        -
                      </span>
                      <span className="text-gray-700 font-medium">
                        Final Amount
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {localDisplayAmount} {selectedTokenData?.symbol}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Credit Units</span>
                    <span className="font-medium text-gray-900">
                      {creditAmount.toString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Rate</span>
                    <span className="font-medium text-gray-900">
                      {conversionRate}
                    </span>
                  </div>

                  {conversionError && (
                    <div className="flex items-center gap-2 text-xs text-chainpay-orange-dark bg-chainpay-orange-light/20 p-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {conversionError}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Pay Button */}
      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 rounded-lg bg-chainpay-blue text-white font-medium flex items-center justify-center gap-2"
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Pay
        </motion.button>
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 text-center text-sm text-gray-600">
        <p>&copy; 2025 ChainPay Africa</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="text-chainpay-blue hover:underline">
            Privacy
          </a>
          <a href="#" className="text-chainpay-blue hover:underline">
            Terms
          </a>
          <a href="#" className="text-chainpay-blue hover:underline">
            Support
          </a>
        </div>
      </div>

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
              className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-md shadow-xl border border-chainpay-blue-light/30 overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
              }}
              data-action="token-select"
            >
              <div className="p-4 border-b border-chainpay-blue-light/20 bg-gradient-to-r from-chainpay-blue-light/10 to-chainpay-blue/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-chainpay-blue-dark flex items-center gap-2">
                    <Coins className="w-4 h-4 text-chainpay-blue" />
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
                    className="p-1 rounded-full hover:bg-chainpay-blue-light/20 transition-colors text-chainpay-blue"
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
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out 
                                  ${
                                    selectedToken === token.id
                                      ? "bg-gradient-to-r from-chainpay-blue-light/30 to-chainpay-blue/20 border border-chainpay-blue-light/50 shadow-sm"
                                      : "hover:bg-gradient-to-r hover:from-chainpay-blue-light/15 hover:to-chainpay-blue/10 border border-transparent hover:border-chainpay-blue-light/30"
                                  }
                                  focus-visible:outline-none focus-visible:border-chainpay-blue focus-visible:shadow-[0_0_0_1px_rgba(0,136,204,0.15)]`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-chainpay-blue-light/20 to-chainpay-blue/30 flex items-center justify-center overflow-hidden border border-chainpay-blue-light/50 shadow-sm">
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
                        <span className="text-sm font-semibold text-chainpay-blue-dark truncate">
                          {token.token}
                        </span>
                        <span className="text-xs text-chainpay-blue truncate">
                          {token.network}
                        </span>
                      </div>

                      {selectedToken === token.id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-chainpay-blue flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white" />
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