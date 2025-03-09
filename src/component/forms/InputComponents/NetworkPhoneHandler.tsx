"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
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
    enum_value: number;
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
    enum_value: number;
  }>({
    id: null,
    name: null,
    iconUrl: null,
    enum_value: 0,
  });
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const phoneNumber = watch("phoneNumber");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
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

  // Detect carrier based on phone number
  useEffect(() => {
    if (isManualSelection) return;

    if (phoneNumber) {
      const detectedCarrier = detectCarrier(phoneNumber);
      if (detectedCarrier) {
        const selected = networks.find(
          (network) => network.id === detectedCarrier.id
        );

        const newCarrier = {
          id: detectedCarrier.id,
          name: detectedCarrier.carrier,
          iconUrl: detectedCarrier.iconUrl,
          enum_value: selected ? selected.enum_value : 0,
        };

        // Only update state if the carrier has changed
        if (
          newCarrier.id !== carrier.id ||
          newCarrier.name !== carrier.name ||
          newCarrier.iconUrl !== carrier.iconUrl ||
          newCarrier.enum_value !== carrier.enum_value
        ) {
          setCarrier(newCarrier);

          if (detectedCarrier.id && selected) {
            setSelectedNetwork(selected);
            onCarrierChange(newCarrier);
          } else {
            onCarrierChange({
              ...selectedNetwork,
              enum_value: selectedNetwork.enum_value,
            });
          }
        }
      }
    } else {
      const newCarrier = { id: null, name: null, iconUrl: null, enum_value: 0 };
      if (
        newCarrier.id !== carrier.id ||
        newCarrier.name !== carrier.name ||
        newCarrier.iconUrl !== carrier.iconUrl ||
        newCarrier.enum_value !== carrier.enum_value
      ) {
        setCarrier(newCarrier);
        onCarrierChange({ ...selectedNetwork, enum_value: selectedNetwork.enum_value });
      }
    }
  }, [phoneNumber, onCarrierChange, selectedNetwork, isManualSelection, carrier]);

  // Reset manual selection flag when phone number changes
  useEffect(() => {
    setIsManualSelection(false);
  }, [phoneNumber]);

  // Handle manual network selection
  const handleNetworkSelect = useCallback(
    (network: {
      id: string;
      name: string;
      iconUrl: string;
      color: string;
      enum_value: number;
    }) => {
      setSelectedNetwork(network);
      onCarrierChange(network);
      setIsDropdownOpen(false);
      setIsManualSelection(true);
    },
    [onCarrierChange]
  );

  // Validate phone number format
  const validatePhoneNumber = useCallback((value: string) => {
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
  }, [setValue]);

  return (
    <div className="space-y-4 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
      <label className="text-tertiary text-[13px] font-bold leading-[16.25px] sm:text-[15px] sm:font-semibold sm:leading-[18.75px] text-gray-700">
        Phone Number
      </label>

      {/* Network Selection and Phone Input Container */}
      <div className="flex items-center gap-3">
        {/* Network Selection Button */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <motion.button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select network"
            aria-expanded={isDropdownOpen}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 
              h-[47px] px-4 rounded-[15px] border border-gray-200
              hover:border-[#0099FF80] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099FF] focus-visible:border-[#0099FF]
              bg-gradient-to-r from-[#0099FF05] to-[#0066FF05]`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] flex items-center justify-center overflow-hidden shadow-sm border border-[#0099FF20]">
                <Image
                  src={selectedNetwork.iconUrl || "/placeholder.svg"}
                  alt={selectedNetwork.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              </div>
              {isDropdownOpen ? (
                <ChevronDown className="w-4 h-4 text-[#0099FF]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#0099FF]" />
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
                className="absolute z-50 mt-2 w-56 bg-white rounded-[15px] shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-2">
                  {networks.map((network) => (
                    <motion.div
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className={`flex items-center gap-3 p-3 rounded-[13px] cursor-pointer transition-all duration-300 ease-in-out
                        ${selectedNetwork.id === network.id
                          ? "bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] border border-[#0099FF]"
                          : "hover:bg-gradient-to-r hover:from-[#0099FF05] hover:to-[#0066FF05] hover:shadow-sm"
                        }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] flex items-center justify-center overflow-hidden border border-[#0099FF20]">
                        <Image
                          src={network.iconUrl || "/placeholder.svg"}
                          alt={network.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                      <span className="text-[15px] font-semibold text-gray-900">
                        {network.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="tel"
            placeholder="Enter phone number"
            {...register("phoneNumber", { validate: validatePhoneNumber })}
            className="w-full h-[47px] pl-10 pr-4 text-[15px] font-medium rounded-[15px] transition-all duration-300 ease-in-out
              border border-gray-200 
              hover:border-[#0099FF80] hover:shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-[#0099FF]
              bg-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100"
          >
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {carrier.id && !isManualSelection && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100"
          >
            <p className="text-sm text-green-600 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>
                Number detected: <strong>{carrier.name}</strong>
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NetworkPhoneHandler;