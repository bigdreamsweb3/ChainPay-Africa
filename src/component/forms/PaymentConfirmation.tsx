import { useBuyAirtime } from "@/hooks/interact/TokenContract";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import React from "react";

interface FormData {
  phoneNumber: string;
  meterNumber: string;
  amount: string;
}

interface PaymentConfirmationProps {
  selectedService: string;
  watch: (field: keyof FormData) => FormData[keyof FormData];
  carrier: { name: string | null };
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
  const { buyAirtime, isPending, error, data } = useBuyAirtime();

  const handleBuyAirtime = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await buyAirtime(
      watch("phoneNumber"),
      watch("amount"),
      carrier.name,
      selectedTokenDetails?.contractAddress
    );

    if (error) {
      console.error("Error buying airtime:", error);
    }   
    if (data) {
      console.log("Airtime bought successfully:", data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          type="button"
          // onClick={prevStep} // You can pass this as a prop if needed
          className="p-2 rounded-md bg-brand-secondary text-white hover:bg-green-200 transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

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
                {/* - Contract: {selectedTokenDetails.contractAddress} */}
              </>
            ) : (
              "None selected"
            )}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <motion.button
            type="button"
            onClick={handleBuyAirtime}
            disabled={isPending}
            className="w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center relative gap-2 md:text-base transition-all duration-200 ease-in-out flex-row border-brand-primary bg-gradient-to-r from-[#0099FF] to-[#0066FF] shadow-md"
            whileInView={{ scale: 1.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
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
