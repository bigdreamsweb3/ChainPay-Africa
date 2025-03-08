"use client";

import type React from "react";
import { useEffect } from "react";
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
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  control,
  setStep,
  setUnavailableServiceMessage,
}) => {
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
    <motion.div
      className="w-full max-w-md mx-auto flex items-center justify-center mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-2">
        <div className="grid grid-cols-3 gap-2">
          {services.map((service) => {
            const isAvailable = appConfig.availableServices.includes(service.name);

            return (
              <Controller
                key={service.id}
                name="serviceType"
                control={control}
                render={({ field }) => (
                  <motion.div
                    className="flex flex-col items-center justify-center w-full"
                    whileHover={{ scale: 1.03 }}
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
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                        field.value === service.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-center whitespace-nowrap">
                        {service.name}
                      </span>
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