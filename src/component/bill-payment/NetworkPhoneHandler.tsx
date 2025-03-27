"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { networks, detectCarrier } from "@/utils/getPhoneCarrierInfo"
import Image from "next/image"
import { Phone, ChevronDown, AlertCircle, Check } from "lucide-react"

interface PhoneNumberInputProps {
  error?: string
  onCarrierChange: (carrier: {
    id: string | null
    name: string | null
    iconUrl: string | null
    enum_value: number
  }) => void
}

const NetworkPhoneHandler: React.FC<PhoneNumberInputProps> = ({ error, onCarrierChange }) => {
  const { register, watch } = useFormContext()
  const [carrier, setCarrier] = useState<{
    id: string | null
    name: string | null
    iconUrl: string | null
    enum_value: number
  }>({
    id: null,
    name: null,
    iconUrl: null,
    enum_value: 0,
  })
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isManualSelection, setIsManualSelection] = useState(false)
  const phoneNumber = watch("phoneNumber")

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  // Detect carrier based on phone number
  useEffect(() => {
    if (isManualSelection) return

    if (phoneNumber) {
      const detectedCarrier = detectCarrier(phoneNumber)
      if (detectedCarrier) {
        const selected = networks.find((network) => network.id === detectedCarrier.id)

        const newCarrier = {
          id: detectedCarrier.id,
          name: detectedCarrier.carrier,
          iconUrl: detectedCarrier.iconUrl,
          enum_value: selected ? selected.enum_value : 0,
        }

        if (
          newCarrier.id !== carrier.id ||
          newCarrier.name !== carrier.name ||
          newCarrier.iconUrl !== carrier.iconUrl ||
          newCarrier.enum_value !== carrier.enum_value
        ) {
          setCarrier(newCarrier)

          if (detectedCarrier.id && selected) {
            setSelectedNetwork(selected)
            onCarrierChange(newCarrier)
          } else {
            onCarrierChange({
              ...selectedNetwork,
              enum_value: selectedNetwork.enum_value,
            })
          }
        }
      }
    } else {
      const newCarrier = { id: null, name: null, iconUrl: null, enum_value: 0 }
      if (
        newCarrier.id !== carrier.id ||
        newCarrier.name !== carrier.name ||
        newCarrier.iconUrl !== carrier.iconUrl ||
        newCarrier.enum_value !== carrier.enum_value
      ) {
        setCarrier(newCarrier)
        onCarrierChange({
          ...selectedNetwork,
          enum_value: selectedNetwork.enum_value,
        })
      }
    }
  }, [phoneNumber, onCarrierChange, selectedNetwork, isManualSelection, carrier])

  // Reset manual selection flag when phone number changes
  useEffect(() => {
    setIsManualSelection(false)
  }, [phoneNumber])

  // Handle manual network selection
  const handleNetworkSelect = useCallback(
    (network: {
      id: string
      name: string
      iconUrl: string
      color: string
      enum_value: number
    }) => {
      setSelectedNetwork(network)
      onCarrierChange(network)
      setIsDropdownOpen(false)
      setIsManualSelection(true)
    },
    [onCarrierChange],
  )

  // Validate phone number format
  const validatePhoneNumber = useCallback((value: string) => {
    if (!value) {
      return true
    }

    const cleanedValue = value.replace(/\D/g, "")

    const isValid =
      (cleanedValue.length === 11 && cleanedValue.startsWith("0")) ||
      (cleanedValue.length === 10 && !cleanedValue.startsWith("0")) ||
      (cleanedValue.length === 13 && cleanedValue.startsWith("234")) ||
      (cleanedValue.length === 14 && cleanedValue.startsWith("2340"))

    if (cleanedValue.length >= 10 && !isValid) {
      return "Please enter a valid Nigerian phone number"
    }
    return true
  }, [])

  const isPhoneValid = phoneNumber && validatePhoneNumber(phoneNumber) === true

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col gap-2 bg-chainpay-blue-light/20 rounded-lg p-3 border border-chainpay-blue-light/20">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-row justify-between items-center gap-3">
            {/* Phone Number Input */}
            <div className="relative w-2/3">
              <input
                type="tel"
                placeholder="Enter phone number"
                {...register("phoneNumber", {
                  validate: validatePhoneNumber,
                })}
                className="w-full text-lg font-medium bg-transparent outline-none text-chainpay-blue-dark placeholder:text-chainpay-blue-dark/40 pr-10"
              />

              {phoneNumber && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isPhoneValid ? (
                    <div className="flex items-center justify-center p-0.5 rounded-full w-4 h-4 border border-brand-success/20">
                      <Check size={12} className="text-brand-success" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-0.5 rounded-full w-4 h-4 border border-chainpay-orange/20">
                      <AlertCircle size={12} className="text-chainpay-orange" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Network Selection Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="networkSelect"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Select network"
                aria-expanded={isDropdownOpen}
                className="bg-white rounded-lg py-1.5 px-3 flex items-center gap-2 w-fit cursor-pointer border border-chainpay-blue-light/20 hover:border-chainpay-blue-light/50 transition-colors duration-200"
              >
                <div className="inline-flex items-center justify-center overflow-hidden w-3.5 h-3.5 min-w-3.5">
                  <Image
                    src={selectedNetwork.iconUrl || "/placeholder.svg"}
                    alt={selectedNetwork.name}
                    width={14}
                    height={14}
                    className="w-full h-full"
                  />
                </div>
                <span className="font-medium text-sm text-chainpay-blue-dark">
                  {selectedNetwork.name?.replace(/\s?Nigeria\s?/g, "")}
                </span>
                <ChevronDown className="w-4 h-4 text-chainpay-blue" />
              </button>

              {/* Network Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-50 right-0 mt-1 w-44 bg-white rounded-lg border border-chainpay-blue-light/20 overflow-hidden shadow-sm">
                  <div className="p-1.5 space-y-0.5">
                    {networks.map((network) => (
                      <div
                        key={network.id}
                        onClick={() => handleNetworkSelect(network)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                          selectedNetwork.id === network.id
                            ? "bg-chainpay-blue-light/20 border border-chainpay-blue-light/30"
                            : "hover:bg-chainpay-blue-light/10 border border-transparent"
                        }`}
                      >
                        <div className="inline-flex items-center justify-center overflow-hidden w-3.5 h-3.5 min-w-3.5">
                          <Image
                            src={network.iconUrl || "/placeholder.svg"}
                            alt={network.name}
                            width={14}
                            height={14}
                            className="w-full h-full"
                          />
                        </div>
                        <span className="text-xs font-medium text-chainpay-blue-dark truncate">{network.name}</span>
                        {selectedNetwork.id === network.id && (
                          <div className="ml-auto w-4 h-4 rounded-full bg-chainpay-blue flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex items-center text-xs font-medium w-2/3">
              <Phone className="text-chainpay-orange w-3.5 h-3.5 pointer-events-none" />
              <span className="text-chainpay-blue-dark ml-1.5">Phone Number</span>
            </div>

            <div className="flex items-center justify-end text-xs font-medium w-1/3">
              <span className="text-chainpay-blue-dark ml-auto">Network Provider</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-2.5 py-1.5 mt-1 rounded-md bg-red-50 border border-red-200">
            <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkPhoneHandler

