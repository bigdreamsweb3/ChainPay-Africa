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
    <div className="w-full">
      <div className="flex flex-col gap-3 bg-background-light  rounded-lg p-4">
        <div className="flex flex-col space-y-3">
          {/* Input Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Phone Number Input */}
            <div className="flex-1 min-w-0">
              <input
                type="tel"
                placeholder="Enter phone number"
                {...register("phoneNumber", {
                  validate: validatePhoneNumber,
                })}
                className="w-full text-base font-medium bg-transparent outline-none text-text-primary placeholder:text-text-muted"
              />
            </div>

            {/* Network Selection */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white rounded-lg py-2 px-3 flex items-center gap-2 min-w-[100px] border border-border-light hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <Image
                    src={selectedNetwork.iconUrl || "/placeholder.svg"}
                    alt={selectedNetwork.name}
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-sm text-text-primary truncate">
                  {selectedNetwork.name?.replace(/\s?Nigeria\s?/g, "")}
                </span>
                <ChevronDown className="w-4 h-4 text-brand-primary shrink-0" />
              </button>

              {/* Network Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-50 right-0 mt-1 w-44 bg-white rounded-lg border border-border-light shadow-sm">
                  <div className="p-1">
                    {networks.map((network) => (
                      <button
                        key={network.id}
                        onClick={() => handleNetworkSelect(network)}
                        className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                          selectedNetwork.id === network.id
                            ? "bg-brand-primary/5 text-brand-primary"
                            : "hover:bg-gray-50 text-text-primary"
                        }`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <Image
                            src={network.iconUrl || "/placeholder.svg"}
                            alt={network.name}
                            width={16}
                            height={16}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium truncate flex-1">
                          {network.name}
                        </span>
                        {selectedNetwork.id === network.id && (
                          <Check className="w-4 h-4 text-brand-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Labels Row */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center text-text-primary">
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
              <span className="ml-1.5 whitespace-nowrap">Phone Number</span>
            </div>
            <div className="text-text-primary whitespace-nowrap">
              Network Provider
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-3 py-2 rounded-md bg-status-error/5 text-status-error text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkPhoneHandler

