"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { Phone, Tv, Wifi, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { appConfig } from "../../app-config";

interface Service {
  id: "airtime" | "data" | "electricity" | "tv";
  name: string;
  icon: LucideIcon;
  badge?: string;
}

const services: Service[] = [
  {
    id: "airtime",
    name: "Airtime",
    icon: Phone,
    // badge: "Up to 6%"
  },
  {
    id: "data",
    name: "Data",
    icon: Wifi,
    // badge: "Up to 6%"
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: Zap,
  },
  {
    id: "tv",
    name: "TV",
    icon: Tv,
  },
] as const;

interface BillPaymentFormData {
  serviceType: "airtime" | "data" | "electricity" | "tv";
  amount: string;
  paymentToken: string;
  phoneNumber?: string;
  meterNumber?: string;
  tvNumber?: string;
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
    <div className="w-full bg-background-light rounded-lg p-4">
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
                  className="relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ease-in-out"
                >
                  {service.badge && (
                    <span className="absolute -top-1 right-0 bg-red-400/90 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      {service.badge}
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${
                      field.value === service.id
                        ? "bg-brand-primary text-white"
                        : "bg-white text-brand-primary shadow-sm"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      field.value === service.id
                        ? "text-brand-primary"
                        : "text-text-primary"
                    }`}
                  >
                    {service.name}
                  </span>
                </button>
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;