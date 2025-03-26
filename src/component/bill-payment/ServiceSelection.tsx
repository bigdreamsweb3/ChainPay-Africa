"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, Wifi, Zap } from "lucide-react";

import { appConfig } from "../../app-config";

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
    const isAvailable = appConfig.availableServices.includes(defaultService.name);

    if (isAvailable) {
      setStep(1);
      setUnavailableServiceMessage(null);
    } else {
      setStep(0);
      setUnavailableServiceMessage(defaultService.name);
    }
  }, [setStep, setUnavailableServiceMessage]);

  return (
    <div className="w-full max-w-md mx-auto">

      {/* Service Selection Card */}
      <motion.div
        className="w-full rounded-xl bg-gradient-to-br from-chainpay-blue-dark/20 to-chainpay-blue/10 backdrop-blur-sm border border-chainpay-blue-light/20 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="p-2">
          <div className="grid grid-cols-4 gap-3">
            {services.map((service) => {
              const isAvailable = appConfig.availableServices.includes(service.name);
              const Icon = service.icon;

              return (
                <Controller
                  key={service.id}
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => {
                        prevServiceRef.current = field.value;
                        field.onChange(service.id);

                        if (isAvailable) {
                          setStep(1);
                          setUnavailableServiceMessage(null);

                          if (preserveCalculation && prevServiceRef.current === service.id) {
                            console.log(`Returning to ${service.name} - preserving calculations`);
                          }
                        } else {
                          setStep(0);
                          setUnavailableServiceMessage(service.name);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 ease-in-out max-w-[100px] transform ${field.value === service.id
                        ? "bg-chainpay-blue text-white scale-105 shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      aria-label={`Select ${service.name}`}
                    >
                      <Icon
                        size={20}
                        className={`mb-1 ${field.value === service.id ? "text-white" : "text-chainpay-blue"
                          }`}
                      />
                      <span className="text-xs font-bold">{service.name}</span>

                      {field.value === service.id && (
                        <motion.div
                          className="absolute -bottom-1 left-1/3 transform -translate-x-1/2 w-8 h-1 bg-chainpay-orange rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </button>
                  )}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Mock appConfig for the component to work
// const appConfig = {
//   availableServices: ["Airtime", "Data", "Electricity"],
// };

export default ServiceSelection;