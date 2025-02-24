"use client";

import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchChain,
} from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { SUPPORTED_CHAIN_IDS } from "@/utils/web3/config";
import Image from "next/image";


export function Account() {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { chains, switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [submitStatus, setSubmitStatus] = useState("idle");

  useEffect(() => {
    if (!address) {
      return;
    }

    // Your effect logic here
  }, [address, chain]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (submitStatus !== "idle") {
        setSubmitStatus("idle");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsNetworkDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!address) return null;


  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleSwitchChain = (chain: (typeof SUPPORTED_CHAIN_IDS)[number]) => {
    switchChain({ chainId: chain.id });
    setIsNetworkDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white px-3 py-1.5 rounded-lg transition-all duration-200"
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
      >
        {ensAvatar ? (
          <Image
            src={ensAvatar || "/placeholder.svg"}
            alt="ENS Avatar"
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">
          {ensName || shortenedAddress}
        </span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md z-10 border border-gray-100"
          >
            {/* Account Info */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                {ensAvatar ? (
                  <Image
                    src={ensAvatar || "/placeholder.svg"}
                    alt="ENS Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0099FF] to-[#0066FF] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {ensName || `${chain?.name} Account`}
                  </h3>
                  <p className="text-xs text-gray-500">{shortenedAddress}</p>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-1.5">
              {/* View on Explorer */}
              <a
                href={`${chain?.blockExplorers?.default.url}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Explorer</span>
              </a>

              {/* Disconnect Option */}
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1.5"></div>

              {/* Switch Network Section */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNetworkDropdownOpen(!isNetworkDropdownOpen)
                  }
                  className="flex items-center space-x-2 px-2 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 w-full text-left"
                >
                  <span>Switch Network</span>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isNetworkDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isNetworkDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-20 border border-gray-100">
                    {chains.map((supportedChain) => (
                      <button
                        key={supportedChain.id}
                        onClick={() => handleSwitchChain(supportedChain)}
                        className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        {supportedChain.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
