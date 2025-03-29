"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { Phone, Wifi, Zap, Blocks } from "lucide-react";

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
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-1.5 text-chainpay-blue-dark">
          <Blocks className="w-3.5 h-3.5 text-chainpay-gold" />
          <span className="text-sm font-semibold">Select Service</span>
        </div>
      </div>

      {/* Service Selection Card */}
      <div className="w-full bg-white backdrop-blur-sm border border-border-light space-y-5 p-3 rounded-xl shadow-sm">
        <div className="grid grid-cols-3 gap-2">
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
                  <button
                    type="button"
                    onClick={() => {
                      prevServiceRef.current = field.value;
                      field.onChange(service.id);

                      if (isAvailable) {
                        setStep(1);
                        setUnavailableServiceMessage(null);

                        if (
                          preserveCalculation &&
                          prevServiceRef.current === service.id
                        ) {
                          console.log(
                            `Returning to ${service.name} - preserving calculations`
                          );
                        }
                      } else {
                        setStep(0);
                        setUnavailableServiceMessage(service.name);
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ease-in-out max-w-[100px] transform border ${
                      field.value === service.id
                        ? "bg-gradient-to-br from-chainpay-blue to-chainpay-blue-dark text-white scale-105 shadow-md"
                        : "bg-white text-chainpay-blue-dark hover:bg-chainpay-blue-light/5 border-chainpay-blue-light/20 hover:border-chainpay-blue-light/30"
                    }`}
                    aria-label={`Select ${service.name}`}
                  >
                    <Icon
                      size={20}
                      className={`mb-1 transition-colors duration-200 ${
                        field.value === service.id
                          ? "text-white"
                          : "text-brand-primary"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors duration-200 ${
                        field.value === service.id
                          ? "text-white"
                          : "text-text-primary"
                      }`}
                    >
                      {service.name}
                    </span>

                    {field.value === service.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-brand-accent rounded-full shadow-sm" />
                    )}
                  </button>
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Mock appConfig for the component to work
// const appConfig = {
//   availableServices: ["Airtime", "Data", "Electricity"],
// };

export default ServiceSelection;
