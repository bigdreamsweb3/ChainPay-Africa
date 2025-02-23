import React from "react";
import { Controller, Control } from "react-hook-form";
import { Smartphone, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { appConfig } from "../../../app-config";

const services = [
  { id: "airtime", name: "Airtime", icon: Smartphone },
  { id: "data", name: "Data", icon: Wifi },
  // { id: "electricity", name: "Electricity", icon: Zap },
] as const;

interface ServiceSelectionProps {
  control: Control<any>;
  selectedService: string;
  setStep: (step: number) => void;
  setUnavailableServiceMessage: (message: string | null) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  control,
  selectedService,
  setStep,
  setUnavailableServiceMessage,
}) => {
  return (
    <motion.div
      className="w-full max-w-md mx-auto rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <div className="p-4">
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
                    whileHover={{ scale: 1.05 }} // Subtle hover animation
                    whileTap={{ scale: 0.95 }} // Tap animation
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          field.onChange(service.id);
                          setStep(1);
                          setUnavailableServiceMessage(null);
                        } else {
                          field.onChange(service.id);
                          setStep(0);
                          setUnavailableServiceMessage(
                            `${service.name} is currently unavailable. Please try again later.`
                          );
                        }
                      }}
                      aria-label={`Select ${service.name}`}
                      className={`relative gap-2 px-4 py-2 rounded-lg text-sm  transition-all duration-300 ease-in-out flex flex-col items-center w-full border-2 bg-white ${
                        selectedService === service.id
                          ? `border-brand-primary bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white`
                          : `border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-border-brand-primary`
                      } 
                      `}
                    >
                      <div className="flex items-center gap-1">
                        <service.icon
                          className={`w-5 h-5 ${
                            selectedService === service.id
                              ? "text-white"
                              : `text-brand-border-brand-primary`
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            selectedService === service.id
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
