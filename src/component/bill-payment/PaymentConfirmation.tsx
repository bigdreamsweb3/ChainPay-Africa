import { useBuyAirtime } from "@/hooks/interact/TokenContract";
import { Loader2, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  convertCreditToTokenAmount,
  convertToTokenUnits,
  formatTokenAmountDisplay,
} from '@/lib/CP_NGN_USD_Vendor';

import Button from '../ui/Button';
import Card from '../ui/Card';
import ChainPayButton from '../ui/ChainPayButton';

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
  const { buyAirtime, isPending } = useBuyAirtime();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<string>(initialConvertedAmount);
  const [displayAmount, setDisplayAmount] = useState<string>(initialDisplayAmount);
  const [isConverting, setIsConverting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  const amountStr = watch("amount");

  // Convert credit units to token amount whenever the amount or selected token changes
  // or if sufficient time has passed since the last update
  useEffect(() => {
    // Skip initial conversion if values are provided and skipInitialConversion is true
    if (skipInitialConversion &&
      initialConvertedAmount !== "0.00" &&
      initialDisplayAmount !== "0" &&
      !isConverting) {
      // Just update the last update time
      setLastUpdateTime(Date.now());
      return;
    }

    // Prevent running this effect if we're already converting
    if (isConverting) return;

    const updateConvertedAmount = async () => {
      if (selectedTokenDetails && amountStr && !isNaN(Number(amountStr))) {
        try {
          setIsConverting(true);
          if (setParentIsConverting) setParentIsConverting(true);

          const tokenAmount = await convertCreditToTokenAmount(Number(amountStr));

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

    // Check if we need to update based on time elapsed
    const timeElapsed = Date.now() - lastUpdateTime;
    const shouldUpdate = timeElapsed > 30000; // 30 seconds threshold

    // Only update if needed and not already converting
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
    // Including isConverting and lastUpdateTime in deps would cause infinite loops
    // since they are updated within the effect itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isConverting,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    lastUpdateTime
  ]);

  const handleBuyAirtime = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedTokenDetails?.contractAddress) {
      setErrorMessage("Please select a payment token");
      return;
    }

    try {
      const phoneNumber = watch("phoneNumber");
      const amountStr = watch("amount");

      if (!phoneNumber || !amountStr) {
        setErrorMessage("Please fill in all required fields");
        return;
      }

      // Validate carrier and network enum
      if (!carrier || carrier.enum_value === undefined || carrier.enum_value === null) {
        setErrorMessage("Please select a network provider");
        return;
      }

      // Network enum should be 0-3 (MTN=0, Airtel=1, Glo=2, Etisalat=3)
      if (carrier.enum_value < 0 || carrier.enum_value > 3) {
        setErrorMessage("Invalid network provider selected");
        return;
      }

      // Wait for conversion to complete if it's still in progress
      if (isConverting) {
        setErrorMessage("Please wait for price calculation to complete");
        return;
      }

      // Check if the conversion is stale (more than 2 minutes old)
      const timeElapsed = Date.now() - lastUpdateTime;
      const isStale = timeElapsed > 120000; // 2 minutes threshold

      // If the conversion is stale, refresh it
      if (isStale) {
        setErrorMessage("Refreshing price information...");

        try {
          setIsConverting(true);
          if (setParentIsConverting) setParentIsConverting(true);

          const tokenAmount = await convertCreditToTokenAmount(Number(amountStr));

          setConvertedAmount(tokenAmount);
          setDisplayAmount(formatTokenAmountDisplay(tokenAmount));
          setLastUpdateTime(Date.now());
          setErrorMessage(null);
        } catch (error) {
          console.error("Error refreshing conversion:", error);
          setErrorMessage("Failed to refresh price. Please try again.");
          return;
        } finally {
          setIsConverting(false);
          if (setParentIsConverting) setParentIsConverting(false);
        }
      }

      // We need to use the converted token amount, not the credit units
      // First, ensure we have a valid converted amount
      if (!convertedAmount || parseFloat(convertedAmount) <= 0) {
        setErrorMessage("Invalid payment amount. Please try again.");
        return;
      }

      // Use our utility function to convert to token units
      // Note: We use the full precision convertedAmount, not the displayAmount 
      // to ensure accuracy in the blockchain transaction
      const decimals = selectedTokenDetails.decimals || 18;
      const tokenUnitsStr = convertToTokenUnits(convertedAmount, decimals);
      const tokenAmountInWei = BigInt(tokenUnitsStr);

      console.log("Sending transaction with:", {
        phoneNumber,
        originalCreditUnits: amountStr, // Original credit units (for reference)
        tokenSymbol: selectedTokenDetails.symbol,
        humanReadableTokenAmount: convertedAmount, // Full precision token amount (e.g., 0.071428 XUSD)
        formattedDisplayAmount: displayAmount, // UI-friendly amount (for reference)
        tokenAmountInWei: tokenAmountInWei.toString(), // The token amount in wei sent to contract
        tokenDecimals: decimals,
        network: carrier.enum_value,
        tokenAddress: selectedTokenDetails.contractAddress,
        lastUpdateTime: new Date(lastUpdateTime).toISOString() // When the conversion was last updated
      });

      // IMPORTANT: We're passing the TOKEN AMOUNT (in wei), not credit units, to the contract
      await buyAirtime(
        phoneNumber,
        tokenAmountInWei, // TOKEN AMOUNT in wei with proper decimals (NOT credit units)
        carrier.enum_value,
        selectedTokenDetails.contractAddress
      );

      // Transaction was successful if we got here
      console.log("Transaction submitted successfully");
      setErrorMessage(null);

    } catch (error: unknown) {
      console.error("Error executing buyAirtime:", error);

      // Type guard for Error objects
      if (error instanceof Error) {
        // Show user-friendly error messages
        if (error.message.includes("rejected in wallet")) {
          setErrorMessage("Transaction was cancelled in your wallet");
        } else if (error.message.includes("Wallet not connected")) {
          setErrorMessage("Please connect your wallet to continue");
        } else {
          setErrorMessage(error.message || "Transaction failed. Please try again.");
        }
      } else {
        setErrorMessage("Transaction failed. Please try again.");
      }
    }
  };

  // Check if we can enable the confirm button
  const isConfirmDisabled = !carrier?.name || !watch("phoneNumber") || !watch("amount") || !selectedTokenDetails;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 mt-0 bg-chainpay-blue-dark/60 backdrop-blur-sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-xl border border-chainpay-blue-light/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-chainpay-blue-light/20 bg-gradient-to-r from-chainpay-blue-light/5 via-white to-chainpay-blue-light/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-chainpay-blue-light/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-chainpay-blue"
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
              <h3 className="text-base font-semibold text-chainpay-blue">Review Transaction</h3>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-chainpay-blue-light/5 transition-colors focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-chainpay-blue/60"
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
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-chainpay-blue-light/20">
              <span className="text-xs text-chainpay-blue/60">Service</span>
              <span className="text-sm font-medium text-chainpay-blue capitalize">{selectedService}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-chainpay-blue-light/20">
              <span className="text-xs text-chainpay-blue/60">
                {selectedService === "electricity" ? "Meter Number" : "Phone Number"}
              </span>
              <span className="text-sm font-medium text-chainpay-blue">
                {selectedService === "electricity" ? watch("meterNumber") : watch("phoneNumber")}
              </span>
            </div>

            {(selectedService === "airtime" || selectedService === "data") && carrier && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-chainpay-blue-light/20">
                <span className="text-xs text-chainpay-blue/60">Network</span>
                <span className="text-sm font-medium text-chainpay-blue">{carrier.name || "Unknown"}</span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-chainpay-blue-light/20">
              <span className="text-xs text-chainpay-blue/60">Amount</span>
              <span className="text-sm font-medium text-chainpay-blue">{watch("amount")} Credit Units</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-chainpay-blue-light/20">
              <span className="text-xs text-chainpay-blue/60">Pay Amount</span>
              <span className="text-sm font-medium text-chainpay-blue">
                {isConverting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Calculating...
                  </span>
                ) : (
                  <>{displayAmount} {selectedTokenDetails?.symbol || ""}</>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-chainpay-blue-light/20">
              <span className="text-xs text-chainpay-blue/60">Payment Token</span>
              <span className="text-sm font-medium text-chainpay-blue">
                {selectedTokenDetails ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white border border-chainpay-blue-light/20 flex items-center justify-center overflow-hidden">
                      <Image
                        src={selectedTokenDetails.image || "/placeholder.svg"}
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

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-red-50/50 border border-red-100">
              <p className="text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-chainpay-blue-light/20">
          <ChainPayButton
            type="button"
            onClick={(e) => handleBuyAirtime(e)}
            disabled={isPending || isConfirmDisabled}
            isLoading={isPending}
            fullWidth
            variant="primary"
            size="large"
          >
            {isPending ? "Processing..." : "Confirm"}
          </ChainPayButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;

