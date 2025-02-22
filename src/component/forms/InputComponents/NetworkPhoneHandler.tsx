"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { networks, detectCarrier } from "@/utils/getPhoneCarrierInfo"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ChevronDown, AlertCircle, Check } from "lucide-react"

interface PhoneNumberInputProps {
  error?: string
  onCarrierChange: (carrier: {
    id: string | null
    name: string | null
    iconUrl: string | null
  }) => void
}

const NetworkPhoneHandler: React.FC<PhoneNumberInputProps> = ({ error, onCarrierChange }) => {
  const { register, watch, setValue } = useFormContext()
  const [carrier, setCarrier] = useState<{
    id: string | null
    name: string | null
    iconUrl: string | null
  }>({
    id: null,
    name: null,
    iconUrl: null,
  })
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isManualSelection, setIsManualSelection] = useState(false)
  const phoneNumber = watch("phoneNumber")

  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (isManualSelection) return

    if (phoneNumber) {
      const detectedCarrier = detectCarrier(phoneNumber)
      if (detectedCarrier) {
        setCarrier({
          id: detectedCarrier.id,
          name: detectedCarrier.carrier,
          iconUrl: detectedCarrier.iconUrl,
        })

        if (detectedCarrier.id) {
          const selected = networks.find((network) => network.id === detectedCarrier.id)
          if (selected) {
            setSelectedNetwork(selected)
            onCarrierChange(selected)
          }
        } else {
          onCarrierChange(selectedNetwork)
        }
      }
    } else {
      setCarrier({ id: null, name: null, iconUrl: null })
      onCarrierChange(selectedNetwork)
    }
  }, [phoneNumber, onCarrierChange, selectedNetwork, isManualSelection])

  useEffect(() => {
    setIsManualSelection(false)
  }, [])

  const handleNetworkSelect = (network: {
    id: string
    name: string
    iconUrl: string
    color: string
  }) => {
    setSelectedNetwork(network)
    onCarrierChange(network)
    setIsDropdownOpen(false)
    setIsManualSelection(true)
  }

  const validatePhoneNumber = (value: string) => {
    const isValid =
      /^\d{10}$/.test(value) || /^234\d{10}$/.test(value) || /^\+234\d{10}$/.test(value) || /^\d{10}$/.test(value)

    if (!isValid) {
      setValue("phoneNumber", "")
      return "Please enter a valid phone number"
    }
    return true
  }

  return (
    <div className="relative space-y-4">
      <label className="block text-lg font-semibold text-gray-700">Phone Number</label>
      <div className="flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <motion.button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select network"
            aria-expanded={isDropdownOpen}
            className="flex items-center bg-white border-2 border-gray-300 rounded-lg py-2 px-3 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden" style={{ backgroundColor: selectedNetwork.color }}>
              <Image
                src={selectedNetwork.iconUrl || "/placeholder.svg"}
                alt={selectedNetwork.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-5 h-5 ml-2 text-gray-500" />
          </motion.button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-56 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                {networks.map((network) => (
                  <motion.div
                    key={network.id}
                    onClick={() => handleNetworkSelect(network)}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    whileHover={{ backgroundColor: network.color, color: "#ffffff" }}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden" style={{ backgroundColor: network.color }}>
                      <Image
                        src={network.iconUrl || "/placeholder.svg"}
                        alt={network.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="ml-3 text-sm font-medium">{network.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div className="flex-1 relative" whileHover={{ scale: 1.02 }}>
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="Enter phone number"
            {...register("phoneNumber", { validate: validatePhoneNumber })}
            className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {carrier.id && !isManualSelection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm text-green-600 flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            <span>
              Number detected: <strong>{carrier.name}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NetworkPhoneHandler

