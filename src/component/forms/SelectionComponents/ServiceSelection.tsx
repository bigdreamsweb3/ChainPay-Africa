"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { motion } from "framer-motion";
import { appConfig } from "../../../app-config";

const services = [
  { id: "airtime", name: "Airtime" },
  { id: "data", name: "Data" },
  { id: "electricity", name: "Electricity" },
] as const;

interface BillPaymentFormData {
  serviceType: "airtime" | "data" | "electricity";
  amount: string;
  paymentToken: string;
  phoneNumber?: string;
  meterNumber?: string;
}

interface ServiceSelectionProps {
  control: Control<BillPaymentFormData>;
  selectedService: string;
  setStep: (step: number) => void;
  setUnavailableServiceMessage: (message: string | null) => void;
  preserveCalculation?: boolean;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  control,
  setStep,
  setUnavailableServiceMessage,
  preserveCalculation = true,
}) => {
  const prevServiceRef = useRef<string | null>(null);
  
  useEffect(() => {
    const defaultService = services[0];
    const isAvailable = appConfig.availableServices.includes(
      defaultService.name
    );

    if (isAvailable) {
      setStep(1);
      setUnavailableServiceMessage(null);
    } else {
      setStep(0);
      setUnavailableServiceMessage(defaultService.name);
    }
  }, [setStep, setUnavailableServiceMessage]);

  return (
    <motion.div
      className="w-full max-w-md mx-auto my-auto flex items-center justify-start mb-1 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-sm w-5/6">
        <div className="w-full flex items-center h-fit justify-start gap-1">
          {services.map((service) => {
            const isAvailable = appConfig.availableServices.includes(
              service.name
            );

            return (
              <Controller
                key={service.id}
                name="serviceType"
                control={control}
                render={({ field }) => (
                  <motion.div
                    className="flex flex-col items-center justify-center w-fit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        prevServiceRef.current = field.value;
                        
                        field.onChange(service.id);
                        
                        if (isAvailable) {
                          setStep(1);
                          setUnavailableServiceMessage(null);
                          
                          const isReturningToPreviousService = 
                            preserveCalculation && 
                            prevServiceRef.current === service.id;
                            
                          if (isReturningToPreviousService) {
                            console.log(`Returning to ${service.name} - preserving calculations`);
                          }
                        } else {
                          setStep(0);
                          setUnavailableServiceMessage(service.name);
                        }
                      }}
                      aria-label={`Select ${service.name}`}
                      className={`relative gap-2 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out  w-full min-w-fit flex flex-col items-center ${field.value === service.id
                        ? "bg-blue-500 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      <div className="flex items-center justify-center">
                        <span
                          className={`text-sm font-medium mx-4 ${field.value === service.id
                            ? "text-white"
                            : "text-gray-700"
                            } text-center whitespace-nowrap`}
                        >
                          {service.name}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="w-1/6"></div>
    </motion.div>
  );
};

export default ServiceSelection;