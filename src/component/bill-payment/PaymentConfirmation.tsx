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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 mt-0 bg-gray-900/60 backdrop-blur-sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-[20px] w-full max-w-md shadow-xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-gray-900">Review Transaction</h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
        <Card
          title=""
          className="max-w-md w-full mx-auto"
        >
          <div >
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-chainpay-blue-light/5 to-chainpay-blue/5 border border-chainpay-blue-light/20">
                <span className="text-sm text-gray-600">Service</span>
                <span className="text-[15px] font-semibold text-gray-900 capitalize">{selectedService}</span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-chainpay-blue-light/5 to-chainpay-blue/5 border border-chainpay-blue-light/20">
                <span className="text-sm text-gray-600">
                  {selectedService === "electricity" ? "Meter Number" : "Phone Number"}
                </span>
                <span className="text-[15px] font-semibold text-gray-900">
                  {selectedService === "electricity" ? watch("meterNumber") : watch("phoneNumber")}
                </span>
              </div>

              {(selectedService === "airtime" || selectedService === "data") && carrier && (
                <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-chainpay-blue-light/5 to-chainpay-blue/5 border border-chainpay-blue-light/20">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-[15px] font-semibold text-gray-900">{carrier.name || "Unknown"}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-chainpay-blue-light/5 to-chainpay-blue/5 border border-chainpay-blue-light/20">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-[15px] font-semibold text-gray-900">{watch("amount")} Credit Units</span>
              </div>

              {/* Display the converted token amount */}
              <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-chainpay-blue-light/5 to-chainpay-blue/5 border border-chainpay-blue-light/20">
                <span className="text-sm text-gray-600">Pay Amount</span>
                <span className="text-[15px] font-semibold text-gray-900">
                  {isConverting ? (
                    <span className="flex items-center">
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Calculating...
                    </span>
                  ) : (
                    <>{displayAmount} {selectedTokenDetails?.symbol || ""}</>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-chainpay-blue-light/5 to-chainpay-blue/5 border border-chainpay-blue-light/20">
                <span className="text-sm text-gray-600">Payment Token</span>
                <span className="text-[15px] font-semibold text-gray-900">
                  {selectedTokenDetails ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-chainpay-blue-light/10 to-chainpay-blue/10 flex items-center justify-center overflow-hidden border border-chainpay-blue-light/20">
                        <Image
                          src={selectedTokenDetails.image || "/placeholder.svg"}
                          alt={selectedTokenDetails.name}
                          width={16}
                          height={16}
                          className="w-4 h-4 rounded-full object-cover"
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
              <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border-light">
            <Button
              type="button"
              onClick={(e) => handleBuyAirtime(e)}
              disabled={isPending || isConfirmDisabled}
              isLoading={isPending}
              fullWidth
            >
              {isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentConfirmation;

