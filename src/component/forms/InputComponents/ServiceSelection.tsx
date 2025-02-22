import React from "react";
import { Controller, Control } from "react-hook-form";
import { Smartphone, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { appConfig } from "../../../app-config";
import { BillPaymentFormData } from "../BillPaymentForm";

// // Define your form data type
// interface BillPaymentFormData {
//   serviceType: string;
//   phoneNumber?: string;
//   meterNumber?: string;
//   amount: string;
//   paymentToken: string;
// }

const services = [
  { id: "airtime", name: "Airtime", icon: Smartphone, color: "blue" },
  { id: "data", name: "Data", icon: Wifi, color: "green" },
  // { id: "electricity", name: "Electricity", icon: Zap, color: "yellow" },
] as const;

interface ServiceSelectionProps {
  control: Control<BillPaymentFormData>;
  selectedService: string;
  setStep: (step: number) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ control, selectedService, setStep }) => {
  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <div className="p-4">
        <div className="flex flex-wrap justify-start gap-4">
          {services.map((service) => {
            const isAvailable = appConfig.availableServices.includes(service.name);
            const colorClasses = {
              blue: {
                bg: "bg-blue-50",
                border: "border-blue-500",
                hover: "hover:bg-blue-100",
                text: "text-white",
                icon: "text-blue-500",
              },
              green: {
                bg: "bg-green-50",
                border: "border-green-500",
                hover: "hover:bg-green-100",
                text: "text-white",
                icon: "text-green-500",
              },
              yellow: {
                bg: "bg-yellow-50",
                border: "border-yellow-500",
                hover: "hover:bg-yellow-100",
                text: "text-white",
                icon: "text-yellow-500",
              },
            };
            const { bg, border, hover, text, icon } = colorClasses[service.color];

            return (
              <Controller
                key={service.id}
                name="serviceType"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col items-center w-20">
                    <button
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          field.onChange(service.id);
                          setStep(1);
                        }
                      }}
                      aria-label={`Select ${service.name}`}
                      className={`p-2 rounded-lg transition-all duration-300 ease-in-out flex flex-col items-center w-full border ${selectedService === service.id
                        ? `${border} ${bg}`
                        : `border-gray-200 ${bg} ${hover} ${text}`
                        } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!isAvailable}>
                      <service.icon className={`w-6 h-6 ${icon} `} />
                    </button>
                    <span className="mt-2 text-sm font-medium text-gray-700 text-center whitespace-nowrap">
                      {service.name} {!isAvailable && <span className="text-xs text-gray-500">(Soon)</span>}
                    </span>
                  </div>
                )}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceSelection;