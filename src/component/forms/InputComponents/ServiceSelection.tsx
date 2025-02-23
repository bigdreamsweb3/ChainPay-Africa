"use client";

import type React from "react";
import { useEffect } from "react";
import { Controller, type Control, FieldValues } from "react-hook-form";
import { Smartphone, Wifi, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { appConfig } from "../../../app-config";

const services = [
  { id: "airtime", name: "Airtime", icon: Smartphone },
  { id: "data", name: "Data", icon: Wifi },
  { id: "electricity", name: "Electricity", icon: Zap },
] as const;

interface BillPaymentFormData {
  serviceType: "airtime" | "data" | "electricity";
  amount: string;
  paymentToken: "pNGN" | "USDC" | "ETH";
  phoneNumber?: string;
  meterNumber?: string;
}

interface ServiceSelectionProps {
  control: Control<BillPaymentFormData>;
  selectedService: string;
  setStep: (step: number) => void;
  setUnavailableServiceMessage: (message: string | null) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  control,
  setStep,
  setUnavailableServiceMessage,
}) => {
  useEffect(() => {
    const defaultService = services[0];
    console.log(defaultService);
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
      className="w-full max-w-md mx-auto flex items-center justify-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <div className="p-1  border-2 border-brand-secondary/50 rounded-full  bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
        <div className="flex flex-wrap justify-start gap-4">
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
                    className="flex flex-col items-center w-24"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(service.id);
                        if (isAvailable) {
                          setStep(1);
                          setUnavailableServiceMessage(null);
                        } else {
                          setStep(0);
                          setUnavailableServiceMessage(service.name);
                        }
                      }}
                      aria-label={`Select ${service.name}`}
                      className={`relative gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out flex flex-col items-center w-full border-2 bg-white ${
                        field.value === service.id
                          ? `border-brand-primary bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white`
                          : `border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-border-brand-primary`
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <service.icon
                          className={`w-4 h-4 ${
                            field.value === service.id
                              ? "text-white"
                              : `text-brand-border-brand-primary`
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            field.value === service.id
                              ? "text-white"
                              : `text-brand-border-brand-primary`
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
    </motion.div>
  );
};

export default ServiceSelection;
