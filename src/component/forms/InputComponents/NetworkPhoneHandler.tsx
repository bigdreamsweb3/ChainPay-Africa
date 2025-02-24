"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { networks, detectCarrier } from "@/utils/getPhoneCarrierInfo";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown, AlertCircle, Check, ChevronRight } from "lucide-react";

interface PhoneNumberInputProps {
  error?: string;
  onCarrierChange: (carrier: {
    id: string | null;
    name: string | null;
    iconUrl: string | null;
  }) => void;
}

const NetworkPhoneHandler: React.FC<PhoneNumberInputProps> = ({
  error,
  onCarrierChange,
}) => {
  const { register, watch, setValue } = useFormContext();
  const [carrier, setCarrier] = useState<{
    id: string | null;
    name: string | null;
    iconUrl: string | null;
  }>({
    id: null,
    name: null,
    iconUrl: null,
  });
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const phoneNumber = watch("phoneNumber");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isManualSelection) return;

    if (phoneNumber) {
      const detectedCarrier = detectCarrier(phoneNumber);
      if (detectedCarrier) {
        setCarrier({
          id: detectedCarrier.id,
          name: detectedCarrier.carrier,
          iconUrl: detectedCarrier.iconUrl,
        });

        if (detectedCarrier.id) {
          const selected = networks.find(
            (network) => network.id === detectedCarrier.id
          );
          if (selected) {
            setSelectedNetwork(selected);
            onCarrierChange(selected);
          }
        } else {
          onCarrierChange(selectedNetwork);
        }
      }
    } else {
      setCarrier({ id: null, name: null, iconUrl: null });
      onCarrierChange(selectedNetwork);
    }
  }, [phoneNumber, onCarrierChange, selectedNetwork, isManualSelection]);

  useEffect(() => {
    setIsManualSelection(false);
  }, []);

  const handleNetworkSelect = (network: {
    id: string;
    name: string;
    iconUrl: string;
    color: string;
  }) => {
    setSelectedNetwork(network);
    onCarrierChange(network);
    setIsDropdownOpen(false);
    setIsManualSelection(true);
  };

  const validatePhoneNumber = (value: string) => {
    const isValid =
      /^\d{10}$/.test(value) ||
      /^234\d{10}$/.test(value) ||
      /^\+234\d{10}$/.test(value) ||
      /^\d{10}$/.test(value);

    if (!isValid) {
      setValue("phoneNumber", "");
      return "Please enter a valid phone number";
    }
    return true;
  };

  return (
    <div className="relative space-y-2">
      <label className="peer-disabled:cursor-not-allowed text-text-primary dark:text-slate-400 peer-disabled:opacity-70 pl-0 text-tertiary text-[13px] font-bold leading-[16.25px] sm:pl-[15px] sm:text-[15px] sm:font-semibold sm:leading-[18.75px]">
        Phone Number
      </label>
      <div className="flex items-center gap-2">
        {/* Network Selection Button */}
        <div
          className={`relative rounded-lg shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          ref={dropdownRef}
          style={{ backgroundColor: selectedNetwork.color }}
        >
          <motion.button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select network"
            aria-expanded={isDropdownOpen}
            className="flex items-center inset-0 rounded-lg bg-gradient-to-r from-transparent to-brand-primary/80 border-gray-300"
            whileInView={{ scale: 1.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 py-1.5 px-3">
              <div
                className="w-6 h-6 rounded-full overflow-hidden shadow-md"
                style={{ backgroundColor: selectedNetwork.color }}
              >
                <Image
                  src={selectedNetwork.iconUrl || "/placeholder.svg"}
                  alt={selectedNetwork.name}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              {isDropdownOpen ? (
                <ChevronDown className="w-4 h-4 text-text-primary bg-brand-secondary/90 rounded-full shadow-lg transition-transform duration-300 transform scale-110" />
              ) : (
                <ChevronRight className="w-4 h-4 text-brand-secondary bg-background-dark/30 rounded-full shadow-2xl transition-transform duration-300 transform scale-100" />
              )}
            </div>
          </motion.button>

          {/* Network Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                {networks.map((network) => (
                  <motion.div
                    key={network.id}
                    onClick={() => handleNetworkSelect(network)}
                    className="flex items-center px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div
                      className="w-6 h-6 rounded-full overflow-hidden border border-gray-200"
                      style={{ backgroundColor: network.color }}
                    >
                      <Image
                        src={network.iconUrl || "/placeholder.svg"}
                        alt={network.name}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {network.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Input */}
        <motion.div className="flex-1 relative" >
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="tel"
            placeholder="Enter phone number"
            {...register("phoneNumber", { validate: validatePhoneNumber })}
            className="w-full px-3 py-2 pl-10 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50"
          />
        </motion.div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-600 flex items-center mt-1"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {carrier.id && !isManualSelection && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-xs text-green-600 flex items-center mt-1"
          >
            <Check className="w-3 h-3 mr-1" />
            <span>
              Number detected: <strong>{carrier.name}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NetworkPhoneHandler;
