import { useBuyAirtime } from "@/hooks/interact/TokenContract";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import React, { useState } from "react";

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
  | { name: string; symbol: string; contractAddress: string }
  | null
  | undefined;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  selectedService,
  watch,
  carrier,
  selectedTokenDetails,
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
    <div className="space-y-6">


      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Confirm Payment</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Service:</strong> {selectedService}
          </p>
          <p className="text-sm text-gray-700">
            <strong>
              {selectedService === "electricity"
                ? "Meter Number"
                : "Phone Number"}
            </strong>
            :{" "}
            {selectedService === "electricity"
              ? watch("meterNumber")
              : watch("phoneNumber")}
          </p>
          {(selectedService === "airtime" || selectedService === "data") &&
            carrier && (
              <p className="text-sm text-gray-700">
                <strong>Network:</strong> {carrier.name || "Unknown"}
              </p>
            )}
          <p className="text-sm text-gray-700">
            <strong>Amount:</strong> {watch("amount")}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Payment Token:</strong>{" "}
            {selectedTokenDetails ? (
              <>
                {selectedTokenDetails.name} ({selectedTokenDetails.symbol})
              </>
            ) : (
              "None selected"
            )}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <motion.button
            type="button"
            onClick={handleBuyAirtime}
            disabled={isPending || isConfirmDisabled}
            className={`w-full px-4 py-2 text-sm text-white rounded-lg flex items-center justify-center relative gap-2 md:text-base transition-all duration-200 ease-in-out flex-row border-brand-primary shadow-md ${isPending || isConfirmDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#0099FF] to-[#0066FF] hover:scale-105"
              }`}
            whileHover={!isConfirmDisabled && !isPending ? { scale: 1.05 } : {}}
            whileTap={!isConfirmDisabled && !isPending ? { scale: 0.98 } : {}}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
