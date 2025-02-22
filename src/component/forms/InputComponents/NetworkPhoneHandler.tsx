import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { detectCarrier } from "@/utils/getPhoneCarrierInfo";
import Image from 'next/image';

interface PhoneNumberInputProps {
  error?: string;
  onCarrierChange: (carrier: {
    id: string | null;
    name: string | null;
    iconUrl: string | null;
  }) => void;
}

const networks = [
  { id: "mtn", name: "MTN Nigeria", iconUrl: "/network-icons/mtn.jpg" },
  { id: "airtel", name: "Airtel Nigeria", iconUrl: "/network-icons/airtel.jpg" },
  { id: "glo", name: "Glo Nigeria", iconUrl: "/network-icons/glo.png" },
  { id: "9mobile", name: "9mobile Nigeria", iconUrl: "/network-icons/9mobile.png" },
  // Add more networks as needed
];

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
  const [selectedNetwork, setSelectedNetwork] = useState<{
    id: string;
    name: string;
    iconUrl: string;
  }>(networks[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [isManualSelection, setIsManualSelection] = useState(false); // State to track manual network selection
  const phoneNumber = watch("phoneNumber");

  useEffect(() => {
    // Reset manual selection state when the phone number changes
    setIsManualSelection(false);
  }, [phoneNumber]);

  useEffect(() => {
    // Skip carrier detection if the user has manually selected a network
    if (isManualSelection) return;

    if (phoneNumber) {
      const detectedCarrier = detectCarrier(phoneNumber);
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
    } else {
      setCarrier({ id: null, name: null, iconUrl: null });
      onCarrierChange(selectedNetwork);
    }
  }, [phoneNumber, onCarrierChange, selectedNetwork, isManualSelection]);

  // Validate phone number format
  const validatePhoneNumber = (value: string) => {
    const isValid =
      /^\d{10}$/.test(value) || // Local format: 09037334349
      /^234\d{10}$/.test(value) || // International format without +: 2349037334349
      /^\+234\d{10}$/.test(value) || // International format with +: +2349037334349
      /^\d{10}$/.test(value); // Just digits: 9037334349

    if (!isValid) {
      setValue("phoneNumber", ""); // Clear the input if invalid
      return "Phone number must be in a valid format";
    }
    return true; // Return true if valid
  };

  // Handle network selection
  const handleNetworkSelect = (network: {
    id: string;
    name: string;
    iconUrl: string;
  }) => {
    setSelectedNetwork(network);
    onCarrierChange(network);
    setIsDropdownOpen(false); // Close dropdown after selection
    setIsManualSelection(true); // Mark as manually selected
  };

  return (
    <div className="relative">
      <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
      <div className="flex items-center">
        {/* Custom Dropdown for Network Selection */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center bg-white border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <Image
              src={selectedNetwork.iconUrl}
              alt={selectedNetwork.name}
              width={16}
              height={16}
              className="w-6 h-6"
            />
          
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
              {networks.map((network) => (
                <div
                  key={network.id}
                  onClick={() => handleNetworkSelect(network)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={network.iconUrl}
                    alt={network.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="ml-2">{network.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Phone Number Input */}
        <input
          type="tel"
          placeholder="Enter phone number"
          {...register("phoneNumber", { validate: validatePhoneNumber })}
          className="flex-1 px-4 py-2 rounded-r-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {carrier.id && !isManualSelection && (
        <div className="mt-1 text-sm text-gray-600 flex items-center">
          <Image
            src={carrier.iconUrl || ""}
            alt={carrier.name || "Unknown Carrier"}
            width={16}
            height={16}
            className="w-4 h-4 mr-2 rounded-full"
          />
          <span>
            This number belongs to <strong>{carrier.name}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default NetworkPhoneHandler;