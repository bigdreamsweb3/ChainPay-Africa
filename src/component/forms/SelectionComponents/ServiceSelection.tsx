"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { motion } from "framer-motion";
import { appConfig } from "../../../app-config";
import { Phone, Wifi, Zap } from "lucide-react";

const services = [
  { id: "airtime", name: "Airtime", icon: Phone },
  { id: "data", name: "Data", icon: Wifi },
  { id: "electricity", name: "Electricity", icon: Zap },
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
      className="w-full max-w-md mx-auto my-auto flex items-center justify-start mb-2 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <div className="p-1.5 bg-white border border-chainpay-blue-light/20 rounded-xl shadow-md w-5/6">
        <div className="w-full flex items-center h-fit justify-start gap-1.5">
          {services.map((service) => {
            const isAvailable = appConfig.availableServices.includes(
              service.name
            );
            const Icon = service.icon;

            return (
              <Controller
                key={service.id}
                name="serviceType"
                control={control}
                render={({ field }) => (
                  <motion.div
                    className="flex flex-col items-center justify-center w-fit flex-1"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
                      className={`relative gap-2 py-2.5 px-2 rounded-lg text-sm transition-all duration-200 ease-in-out w-full min-w-fit flex flex-col items-center ${field.value === service.id
                        ? "bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark text-white shadow-md"
                        : "hover:bg-chainpay-blue-light/10 text-chainpay-blue-dark border border-transparent hover:border-chainpay-blue-light/20"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className={`
                          w-5 h-5 flex items-center justify-center rounded-full  
                          ${field.value === service.id
                            ? "bg-white/20"
                            : "bg-chainpay-blue-light/20"
                          }
                        `}>
                          <Icon
                            size={14}
                            className={`
                              ${field.value === service.id
                                ? "text-white"
                                : "text-chainpay-blue"
                              }
                            `}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${field.value === service.id
                            ? "text-white"
                            : "text-chainpay-blue-dark"
                            } text-center whitespace-nowrap`}
                        >
                          {service.name}
                        </span>
                      </div>

                      {/* Subtle Indication for Selected Tab */}
                      {field.value === service.id && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-t-full opacity-70"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
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