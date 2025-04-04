"use client";

import { useBuyAirtime } from "@/hooks/interact/TokenContract";
import { Loader2, AlertCircle, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import {
  convertCreditToTokenAmount,
  convertToTokenUnits,
  formatTokenAmountDisplay,
} from "@/lib/CP_NGN_USD_Vendor";
import ChainPayButton from "../ui/ChainPayButton";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface FormData {
  phoneNumber: string;
  meterNumber: string;
  amount: string;
}

interface PaymentConfirmationProps {
  selectedService: string;
  watch: (field: keyof FormData) => FormData[keyof FormData];
  carrier: {
    name: string | null;
    enum_value: number;
  };
  selectedTokenDetails:
    | {
        name: string;
        symbol: string;
        contractAddress: string;
        image: string;
        decimals: number;
        network: string;
        token: string;
        address: string;
        id: string;
      }
    | null
    | undefined;
  onClose: () => void;
  setParentIsConverting?: (state: boolean) => void;
  convertedAmount?: string;
  displayAmount?: string;
  skipInitialConversion?: boolean;
}

type TransactionStatus =
  | "idle"
  | "initializing"
  | "approving"
  | "waiting_approval"
  | "purchasing"
  | "completed"
  | "error"
  | "refreshing_price";

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  selectedService,
  watch,
  carrier,
  selectedTokenDetails,
  onClose,
  setParentIsConverting,
  convertedAmount: initialConvertedAmount = "0.00",
  displayAmount: initialDisplayAmount = "0",
  skipInitialConversion = false,
}) => {
  const { buyAirtime, isPending, data } = useBuyAirtime();
  const { chain } = useAccount();
  const blockExplorerUrl =
    chain?.blockExplorers?.default?.url || "https://etherscan.io";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>("idle");
  const [convertedAmount, setConvertedAmount] = useState<string>(
    initialConvertedAmount
  );
  const [displayAmount, setDisplayAmount] =
    useState<string>(initialDisplayAmount);
  const [isConverting, setIsConverting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [mounted, setMounted] = useState(false);

  const amountStr = watch("amount");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      skipInitialConversion &&
      initialConvertedAmount !== "0.00" &&
      initialDisplayAmount !== "0" &&
      !isConverting
    ) {
      setLastUpdateTime(Date.now());
      return;
    }

    if (isConverting) return;

    const updateConvertedAmount = async () => {
      if (selectedTokenDetails && amountStr && !isNaN(Number(amountStr))) {
        try {
          setIsConverting(true);
          if (setParentIsConverting) setParentIsConverting(true);
          const tokenAmount = await convertCreditToTokenAmount(
            Number(amountStr)
          );
          setConvertedAmount(tokenAmount);
          setDisplayAmount(formatTokenAmountDisplay(tokenAmount));
          setLastUpdateTime(Date.now());
        } catch (error) {
          console.error("Error converting amount:", error);
          setConvertedAmount("0.00");
          setDisplayAmount("0");
        } finally {
          setIsConverting(false);
          if (setParentIsConverting) setParentIsConverting(false);
        }
      } else {
        setConvertedAmount("0.00");
        setDisplayAmount("0");
      }
    };

    const timeElapsed = Date.now() - lastUpdateTime;
    const shouldUpdate = timeElapsed > 30000;

    if ((!skipInitialConversion || shouldUpdate) && !isConverting) {
      updateConvertedAmount();
    }
  }, [
    amountStr,
    selectedTokenDetails,
    setParentIsConverting,
    skipInitialConversion,
    initialConvertedAmount,
    initialDisplayAmount,
    isConverting,
    lastUpdateTime,
  ]);

  const handleBuyAirtime = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (transactionStatus !== "idle" && transactionStatus !== "error") return;

    setErrorMessage(null);
    setTransactionStatus("initializing");

    const hasValidInputs =
      carrier?.name &&
      watch("phoneNumber") &&
      watch("amount") &&
      selectedTokenDetails?.contractAddress;

    if (!hasValidInputs) {
      setErrorMessage(
        !selectedTokenDetails?.contractAddress
          ? "Please select a payment token"
          : "Please fill in all required fields"
      );
      setTransactionStatus("error");
      return;
    }

    try {
      const phoneNumber = watch("phoneNumber");
      const amountStr = watch("amount");

      if (
        !carrier ||
        carrier.enum_value === undefined ||
        carrier.enum_value === null
      ) {
        setErrorMessage("Please select a network provider");
        setTransactionStatus("error");
        return;
      }

      if (carrier.enum_value < 0 || carrier.enum_value > 3) {
        setErrorMessage("Invalid network provider selected");
        setTransactionStatus("error");
        return;
      }

      if (isConverting) {
        setErrorMessage("Please wait for price calculation to complete");
        setTransactionStatus("error");
        return;
      }

      const timeElapsed = Date.now() - lastUpdateTime;
      const isStale = timeElapsed > 120000;

      if (isStale) {
        setErrorMessage("Refreshing price information...");
        setTransactionStatus("refreshing_price");

        try {
          setIsConverting(true);
          if (setParentIsConverting) setParentIsConverting(true);
          const tokenAmount = await convertCreditToTokenAmount(
            Number(amountStr)
          );
          setConvertedAmount(tokenAmount);
          setDisplayAmount(formatTokenAmountDisplay(tokenAmount));
          setLastUpdateTime(Date.now());
          setErrorMessage(null);
        } catch (error) {
          console.error("Error refreshing conversion:", error);
          setErrorMessage("Failed to refresh price. Please try again.");
          setTransactionStatus("error");
          return;
        } finally {
          setIsConverting(false);
          if (setParentIsConverting) setParentIsConverting(false);
        }
      }

      if (!convertedAmount || parseFloat(convertedAmount) <= 0) {
        setErrorMessage("Invalid payment amount. Please try again.");
        setTransactionStatus("error");
        return;
      }

      const decimals = selectedTokenDetails.decimals || 18;
      const tokenUnitsStr = convertToTokenUnits(convertedAmount, decimals);
      const tokenAmountInWei = BigInt(tokenUnitsStr);

      await buyAirtime(
        phoneNumber,
        tokenAmountInWei,
        carrier.enum_value as 0 | 1 | 2 | 3,
        selectedTokenDetails.contractAddress as `0x${string}`,
        selectedTokenDetails.symbol,
        watch("amount"),
        (status: TransactionStatus) => {
          setTransactionStatus(status);
          switch (status) {
            case "approving":
              setErrorMessage(
                "Please approve the token spending in your wallet..."
              );
              break;
            case "waiting_approval":
              setErrorMessage(
                "Waiting for approval transaction to be confirmed..."
              );
              break;
            case "purchasing":
              setErrorMessage("Initiating airtime purchase...");
              break;
            case "completed":
              setErrorMessage(null);
              break;
            case "error":
              setErrorMessage("Transaction failed. Please try again.");
              break;
          }
        }
      );

      console.log("Transaction submitted successfully");
      setErrorMessage(null);
      setTransactionStatus("completed");
    } catch (error: unknown) {
      console.error("Error executing buyAirtime:", error);
      setTransactionStatus("error");
      if (error instanceof Error) {
        if (error.message.includes("rejected in wallet") || error.message.includes("User denied transaction signature")) {
          setErrorMessage("Transaction was cancelled in your wallet");
        } else if (error.message.includes("Wallet not connected")) {
          setErrorMessage("Please connect your wallet to continue");
        } else if (error.message.includes("insufficient funds")) {
          setErrorMessage("Insufficient funds in your wallet");
        } else if (error.message.includes("nonce")) {
          setErrorMessage("Please try again. Transaction nonce error.");
        } else {
          setErrorMessage("Transaction failed. Please try again.");
        }
      } else {
        setErrorMessage("Transaction failed. Please try again.");
      }
    }
  };

  const isProcessing = [
    "initializing",
    "approving",
    "waiting_approval",
    "purchasing",
  ].includes(transactionStatus);
  const canConfirm =
    transactionStatus === "idle" || transactionStatus === "error";
  const isConfirmDisabled =
    !carrier?.name ||
    !watch("phoneNumber") ||
    !watch("amount") ||
    !selectedTokenDetails ||
    !canConfirm ||
    isPending ||
    isConverting;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center p-4 bg-background-overlay dark:bg-background-dark/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-background-dark-card rounded-lg w-full max-w-md shadow-xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-brand-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
                {transactionStatus === "error"
                  ? "Transaction Failed"
                  : "Review Transaction"}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-lg text-text-muted dark:text-text-dark-muted hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-background-light dark:hover:bg-background-dark-light transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex-grow">
          <div className="space-y-4">
            {/* Success Message */}
            <AnimatePresence>
              {transactionStatus === "completed" && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-brand-primary/5 dark:from-brand-primary/10 to-brand-primary/10 dark:to-brand-primary/20"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                        Transaction Successful!
                      </h4>
                      <p className="text-sm text-text-muted dark:text-text-dark-muted">
                        Your airtime will be delivered shortly. You can track
                        the status using the transaction link below.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transaction Details */}
            {transactionStatus !== "completed" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                  <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">Service</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary capitalize">
                    {selectedService}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                  <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">
                    {selectedService === "electricity"
                      ? "Meter Number"
                      : "Phone Number"}
                  </span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                    {selectedService === "electricity"
                      ? watch("meterNumber")
                      : watch("phoneNumber")}
                  </span>
                </div>
                {(selectedService === "airtime" ||
                  selectedService === "data") &&
                  carrier && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                      <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">Network</span>
                      <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                        {carrier.name || "Unknown"}
                      </span>
                    </div>
                  )}
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                  <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">Amount</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                    {watch("amount")} Credits
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                  <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">Pay Amount</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                    {isConverting ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                        Calculating...
                      </span>
                    ) : (
                      <>
                        {displayAmount} {selectedTokenDetails?.symbol || ""}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                  <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">Payment Token</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                    {selectedTokenDetails ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-background-dark flex items-center justify-center overflow-hidden">
                          <Image
                            src={
                              selectedTokenDetails.image || "/placeholder.svg"
                            }
                            alt={selectedTokenDetails.name}
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain"
                          />
                        </div>
                        {selectedTokenDetails.symbol}
                      </div>
                    ) : (
                      "None selected"
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Transaction Status */}
            {isProcessing && (
              <div className="mt-4 p-3 rounded-lg bg-background-light dark:bg-background-dark-light">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted dark:text-text-dark-muted">Status</span>
                  <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                    {transactionStatus === "initializing" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                        Initializing...
                      </>
                    )}
                    {transactionStatus === "approving" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                        Waiting for approval...
                      </>
                    )}
                    {transactionStatus === "waiting_approval" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                        Confirming approval...
                      </>
                    )}
                    {transactionStatus === "purchasing" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                        Processing purchase...
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && transactionStatus !== "completed" && (
              <div className="mt-4 p-3 rounded-lg bg-status-error/10 dark:bg-status-error/20">
                <p className="text-xs text-status-error flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex-shrink-0">
          {transactionStatus === "completed" ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    window.open(`${blockExplorerUrl}/tx/${data}`, "_blank")
                  }
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Transaction on Explorer
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${blockExplorerUrl}/tx/${data}`
                    );
                    setErrorMessage("Transaction link copied to clipboard!");
                    setTimeout(() => setErrorMessage(null), 3000);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy Transaction Link
                </button>
              </div>
              <ChainPayButton
                type="button"
                onClick={onClose}
                fullWidth
                variant="secondary"
                size="large"
              >
                Close
              </ChainPayButton>
            </div>
          ) : (
            <ChainPayButton
              type="button"
              onClick={handleBuyAirtime}
              disabled={isConfirmDisabled}
              isLoading={isProcessing}
              fullWidth
              variant="primary"
              size="large"
            >
              {isProcessing
                ? "Processing..."
                : transactionStatus === "error"
                ? "Try Again"
                : "Confirm"}
            </ChainPayButton>
          )}
        </div>
      </motion.div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
};

export default PaymentConfirmation;
