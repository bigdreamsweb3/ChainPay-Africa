"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { networks, detectCarrier } from "@/utils/getPhoneCarrierInfo";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown, AlertCircle, Check } from "lucide-react";

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
  const [isFocused, setIsFocused] = useState(false);
  const [isNetworkFocused, setIsNetworkFocused] = useState(false);

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
    // Don't validate empty inputs
    if (!value) {
      return true;
    }
    
    // Clean the phone number - remove any non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
    
    // Check for Nigerian phone number formats
    // 1. Standard 11 digit format starting with 0 (e.g. 0903... -> 11 digits)
    // 2. 10 digit format without leading 0 (e.g. 903... -> 10 digits)
    // 3. Format with country code 234 (e.g. 234903... -> 13 digits)
    // 4. Format with + and country code (e.g. +234903... -> 14 digits)
    const isValid = 
      (cleanedValue.length === 11 && cleanedValue.startsWith('0')) || 
      (cleanedValue.length === 10 && !cleanedValue.startsWith('0')) ||
      (cleanedValue.length === 13 && cleanedValue.startsWith('234')) ||
      (cleanedValue.length === 14 && cleanedValue.startsWith('2340'));

    // Only return error message for completed numbers, don't clear the field
    if (cleanedValue.length >= 10 && !isValid) {
      return "Please enter a valid Nigerian phone number";
    }
    return true;
  }, []);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleNetworkFocus = () => setIsNetworkFocused(true);
  const handleNetworkBlur = () => setIsNetworkFocused(false);

  // Phone validation successful
  const isPhoneValid = phoneNumber && validatePhoneNumber(phoneNumber) === true;

  return (
    <div className="space-y-3 bg-white rounded-lg p-4 shadow-md border border-chainpay-blue-light/10">
      <label className="text-sm font-medium text-chainpay-blue flex items-center gap-1.5">
        <Phone className="w-4 h-4 text-chainpay-blue" />
        Phone & Network
      </label>

      {/* Network Selection and Phone Input Container */}
      <div className="flex items-stretch gap-2">

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chainpay-blue-light w-4 h-4 z-10 pointer-events-none" />
          <motion.div
            className="relative w-full h-full"
            animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <input
              type="tel"
              placeholder="Enter phone number"
              {...register("phoneNumber", { validate: validatePhoneNumber })}
              className="w-full h-11 pl-9 pr-10 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                border border-chainpay-blue-light/30
                hover:border-chainpay-blue hover:shadow-sm
                focus:outline-none focus:border-chainpay-blue
                focus:shadow-[0_0_0_1px_rgba(0,136,204,0.15),0_2px_10px_-2px_rgba(0,136,204,0.15)]
                bg-white placeholder:text-chainpay-blue-light/50"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </motion.div>
          
          {/* Phone number validation indicator - fixing position */}
          {phoneNumber && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-3.5 top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none"
            >
              {isPhoneValid ? (
                <div className="flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm p-0.5 rounded-full w-5 h-5">
                  <Check size={14} className="text-green-600" />
                </div>
              ) : (
                <div className="flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm p-0.5 rounded-full w-5 h-5">
                  <AlertCircle size={14} className="text-chainpay-orange" />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Network Selection Button */}
        <div className="relative self-center" ref={dropdownRef}>
          <motion.button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onFocus={handleNetworkFocus}
            onBlur={handleNetworkBlur}
            aria-label="Select network"
            aria-expanded={isDropdownOpen}
            className={`flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 
              h-11 px-3 rounded-lg border shadow-sm
              border-chainpay-blue-light/30 hover:border-chainpay-blue hover:bg-chainpay-blue-light/5 bg-white
              focus:outline-none focus:border-chainpay-blue
              focus:shadow-[0_0_0_1px_rgba(0,136,204,0.15),0_2px_8px_-2px_rgba(0,136,204,0.15)]`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-chainpay-blue-light/10 to-chainpay-blue/20 flex items-center justify-center overflow-hidden border border-chainpay-blue-light/30 shadow-sm">
              <Image
                src={selectedNetwork.iconUrl || "/placeholder.svg"}
                alt={selectedNetwork.name}
                width={24}
                height={24}
                className="w-5 h-5 rounded-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-chainpay-blue-dark">{selectedNetwork.name?.replace(/\s?Nigeria\s?/g, '')}</span>
            <ChevronDown className="w-4 h-4 text-chainpay-blue" />
          </motion.button>

          {/* Network Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-50 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-chainpay-blue-light/20 overflow-hidden"
              >
                <div className="p-1.5">
                  {networks.map((network) => (
                    <motion.div
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all duration-200
                        ${selectedNetwork.id === network.id
                          ? "bg-gradient-to-r from-chainpay-blue-light/20 to-chainpay-blue/10 border border-chainpay-blue-light/30 shadow-sm"
                          : "hover:bg-gradient-to-r hover:from-chainpay-blue-light/10 hover:to-chainpay-blue/5 border border-transparent hover:border-chainpay-blue-light/20"
                        }
                        focus-visible:outline-none focus-visible:border-chainpay-blue focus-visible:shadow-[0_0_0_1px_rgba(0,136,204,0.2)]`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-chainpay-blue-light/10 to-chainpay-blue/20 flex items-center justify-center overflow-hidden border border-chainpay-blue-light/30 shadow-sm">
                        <Image
                          src={network.iconUrl || "/placeholder.svg"}
                          alt={network.name}
                          width={28}
                          height={28}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-chainpay-blue-dark">
                        {network.name}
                      </span>
                      
                      {selectedNetwork.id === network.id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-chainpay-blue flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
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
            className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 shadow-sm"
          >
            <p className="text-sm text-red-600 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Helper Text */}
      <p className="text-xs text-chainpay-blue-dark/60 mt-1">
        Enter a valid Nigerian phone number to continue
      </p>
    </div>
  );
};

export default NetworkPhoneHandler;