"use client";

import { useState } from "react";
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

  if (!address) return null;

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleSwitchChain = (chain: (typeof SUPPORTED_CHAIN_IDS)[number]) => {
    switchChain({ chainId: chain.id });
    setIsNetworkDropdownOpen(false);
  };

  // console.log(chain);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white px-4 py-2 rounded-lg transition-all duration-200"
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
      >
        {ensAvatar ? (
          <Image
            src={ensAvatar || "/placeholder.svg"}
            alt="ENS Avatar"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-md z-10 border border-gray-100"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {ensAvatar ? (
                  <Image
                    src={ensAvatar || "/placeholder.svg"}
                    alt="ENS Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-[#0099FF] to-[#0066FF] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-800">
                    {ensName || `${chain?.name} Account`}
                  </h3>
                  <p className="text-xs text-gray-500">{shortenedAddress}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <a
                href={`${chain?.blockExplorers?.default.url}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on {chain?.blockExplorers?.default.name}</span>
              </a>
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNetworkDropdownOpen(!isNetworkDropdownOpen)
                  }
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 w-full text-left"
                >
                  <span>Switch Network</span>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isNetworkDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isNetworkDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-20">
                    {chains.map((supportedChain) => (
                      <button
                        key={supportedChain.id}
                        onClick={() => handleSwitchChain(supportedChain)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
