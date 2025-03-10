"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { networks, detectCarrier } from "@/utils/getPhoneCarrierInfo";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown, AlertCircle } from "lucide-react";

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
    <div className="space-y-3 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <label className="text-sm font-medium text-gray-700">
        Phone & Network
      </label>

      {/* Network Selection and Phone Input Container */}
      <div className="flex items-center gap-2">

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="tel"
            placeholder="Enter phone number"
            {...register("phoneNumber", { validate: validatePhoneNumber })}
            className="w-full h-10 pl-9 pr-3 text-sm font-medium rounded-lg border border-gray-300
              hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
              bg-white placeholder:text-gray-400 transition-all duration-200"
          />
        </div>

        {/* Network Selection Button */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select network"
            aria-expanded={isDropdownOpen}
            className={`flex items-center justify-center gap-2 h-10 px-3 rounded-lg border border-gray-300
              hover:border-blue-500 hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500
              bg-white transition-all duration-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden border border-blue-200">
              <Image
                src={selectedNetwork.iconUrl || "/placeholder.svg"}
                alt={selectedNetwork.name}
                width={24}
                height={24}
                className="w-5 h-5 rounded-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-900">{selectedNetwork.name?.replace(/\s?Nigeria\s?/g, '')}</span>
            <ChevronDown className="w-4 h-4 text-blue-500" />
          </motion.button>

          {/* Network Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-1">
                  {networks.map((network) => (
                    <motion.div
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200
                        ${selectedNetwork.id === network.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden border border-blue-200">
                        <Image
                          src={network.iconUrl || "/placeholder.svg"}
                          alt={network.name}
                          width={24}
                          height={24}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {network.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
      {/* <AnimatePresence>
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
      </AnimatePresence> */}
    </div>
  );
};

export default NetworkPhoneHandler;