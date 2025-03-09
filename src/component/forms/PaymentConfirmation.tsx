import { useBuyAirtime } from "@/hooks/interact/TokenContract";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

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
  | { name: string; symbol: string; contractAddress: string; image: string }
  | null
  | undefined;
  onClose: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  selectedService,
  watch,
  carrier,
  selectedTokenDetails,
  onClose,
}) => {
  const { buyAirtime, isPending } = useBuyAirtime();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      // Convert amount directly without Wei conversion
      // This will use the amount as is for credit units
      const amount = BigInt(Math.floor(parseFloat(amountStr)));

      console.log("Sending transaction with:", {
        phoneNumber,
        amount: amount.toString(), // This will now be the actual credit units
        network: carrier.enum_value,
        token: selectedTokenDetails.contractAddress
      });

      await buyAirtime(
        phoneNumber,
        amount,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-gray-900">Confirm Transaction</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:ring-offset-2"
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
        <div className="p-6 space-y-6">
          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-[#0099FF05] to-[#0066FF05] border border-[#0099FF20]">
              <span className="text-sm text-gray-600">Service</span>
              <span className="text-[15px] font-semibold text-gray-900 capitalize">{selectedService}</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-[#0099FF05] to-[#0066FF05] border border-[#0099FF20]">
              <span className="text-sm text-gray-600">
                {selectedService === "electricity" ? "Meter Number" : "Phone Number"}
              </span>
              <span className="text-[15px] font-semibold text-gray-900">
                {selectedService === "electricity" ? watch("meterNumber") : watch("phoneNumber")}
              </span>
            </div>

            {(selectedService === "airtime" || selectedService === "data") && carrier && (
              <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-[#0099FF05] to-[#0066FF05] border border-[#0099FF20]">
                <span className="text-sm text-gray-600">Network</span>
                <span className="text-[15px] font-semibold text-gray-900">{carrier.name || "Unknown"}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-[#0099FF05] to-[#0066FF05] border border-[#0099FF20]">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-[15px] font-semibold text-gray-900">{watch("amount")}</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-[15px] bg-gradient-to-r from-[#0099FF05] to-[#0066FF05] border border-[#0099FF20]">
              <span className="text-sm text-gray-600">Payment Token</span>
              <span className="text-[15px] font-semibold text-gray-900">
                {selectedTokenDetails ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] flex items-center justify-center overflow-hidden border border-[#0099FF20]">
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
        <div className="p-6 border-t border-gray-100">
          <motion.button
            type="button"
            onClick={handleBuyAirtime}
            disabled={isPending || isConfirmDisabled}
            className={`inline-flex items-center justify-center gap-2 w-full h-[47px] rounded-[15px] transition-all duration-300 
              ${isPending || isConfirmDisabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0099FF] to-[#0066FF] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              }`}
            whileHover={!isConfirmDisabled && !isPending ? { scale: 1.02 } : {}}
            whileTap={!isConfirmDisabled && !isPending ? { scale: 0.98 } : {}}
          >
            <span className="text-[15px] font-semibold text-white">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
