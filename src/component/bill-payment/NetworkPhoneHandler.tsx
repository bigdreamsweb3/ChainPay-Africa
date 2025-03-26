"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { networks, detectCarrier } from "@/utils/getPhoneCarrierInfo";
import Image from "next/image";
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
  const { register, watch } = useFormContext();
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
        onCarrierChange({
          ...selectedNetwork,
          enum_value: selectedNetwork.enum_value,
        });
      }
    }
  }, [
    phoneNumber,
    onCarrierChange,
    selectedNetwork,
    isManualSelection,
    carrier,
  ]);

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
    if (!value) {
      return true;
    }

    const cleanedValue = value.replace(/\D/g, "");

    const isValid =
      (cleanedValue.length === 11 && cleanedValue.startsWith("0")) ||
      (cleanedValue.length === 10 && !cleanedValue.startsWith("0")) ||
      (cleanedValue.length === 13 && cleanedValue.startsWith("234")) ||
      (cleanedValue.length === 14 && cleanedValue.startsWith("2340"));

    if (cleanedValue.length >= 10 && !isValid) {
      return "Please enter a valid Nigerian phone number";
    }
    return true;
  }, []);

  const isPhoneValid = phoneNumber && validatePhoneNumber(phoneNumber) === true;

  return (
    <div className="max-w-md mx-auto bg-[#F1F5F9] rounded-xl p-1">
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
        <div className="p-3 space-y-4">
          <div className="flex flex-row sm:items-stretch gap-4">
            {/* Phone Number Input */}
            <div className="flex-1 relative">
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-bold text-[#1E293B] mb-2 ml-0.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF9900] w-4 h-4 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  {...register("phoneNumber", {
                    validate: validatePhoneNumber,
                  })}
                  className="w-full h-10 px-3 pl-10 pr-10 text-sm rounded-lg border border-[#E2E8F0] hover:border-[#A1A1AA] focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/30 placeholder:text-[#A1A1AA] text-[#1E293B]"
                />
                {phoneNumber && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isPhoneValid ? (
                      <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 border border-[#22C55E]/30">
                        <Check size={14} className="text-[#22C55E]" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-0.5 rounded-full w-5 h-5 border border-[#FF9900]/30">
                        <AlertCircle size={14} className="text-[#FF9900]" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Network Selection Button */}
            <div className="relative" ref={dropdownRef}>
              <label
                htmlFor="networkSelect"
                className="block text-xs font-bold text-[#1E293B] mb-2 ml-0.5"
              >
                Network Provider
              </label>
              <button
                id="networkSelect"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Select network"
                aria-expanded={isDropdownOpen}
                className="flex items-center justify-between gap-2 h-10 px-3 rounded-lg transition-all duration-200 border border-[#E2E8F0] hover:border-[#A1A1AA] focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/30 w-fit min-w-10"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#E2E8F0]">
                  <Image
                    src={selectedNetwork.iconUrl || "/placeholder.svg"}
                    alt={selectedNetwork.name}
                    width={24}
                    height={24}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-[#1E293B]">
                  {selectedNetwork.name?.replace(/\s?Nigeria\s?/g, "")}
                </span>
                <ChevronDown className="w-4 h-4 text-[#60A5FA]" />
              </button>

              {/* Network Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-50 right-0 mt-2 w-auto min-w-[180px] max-w-[260px] bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-lg overflow-hidden">
                  <div className="p-2 space-y-1.5">
                    {networks.map((network) => (
                      <div
                        key={network.id}
                        onClick={() => handleNetworkSelect(network)}
                        className={`flex items-center gap-2.5 p-3 rounded-md cursor-pointer ${
                          selectedNetwork.id === network.id
                            ? "bg-[#E0F2FE] border border-[#60A5FA]/50"
                            : "hover:bg-[#F1F5F9] border border-transparent"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E2E8F0]">
                          <Image
                            src={network.iconUrl || "/placeholder.svg"}
                            alt={network.name}
                            width={28}
                            height={28}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-[#1E293B] truncate">
                          {network.name}
                        </span>
                        {selectedNetwork.id === network.id && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-[#60A5FA] flex items-center justify-center">
                            <Check size={12} className="text-[#FFFFFF]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] shadow-sm">
              <p className="text-sm text-[#DC2626] flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPhoneHandler;