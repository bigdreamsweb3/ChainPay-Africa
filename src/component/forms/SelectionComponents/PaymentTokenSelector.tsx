"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useAccount } from "wagmi"; // Import useAccount from wagmi
import { AlertCircle } from "lucide-react"; // Import AlertCircle for error handling

interface PaymentToken {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  image: string;
}

interface PaymentTokenSelectorProps {
  paymentTokens: PaymentToken[];
  selectedToken: string;
  setSelectedToken: (tokenId: string) => void;
}

const PaymentTokenSelector: React.FC<PaymentTokenSelectorProps> = ({
  paymentTokens,
  selectedToken,
  setSelectedToken,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const defaultLogo = "/images/logo.jpg"; // Path to your local fallback logo
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const { isConnected } = useAccount(); // Check if wallet is connected

  // Find the selected token object
  const selectedTokenData = paymentTokens.find(
    (token) => token.id === selectedToken
  );

  return (
    <div className="space-y-4 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
      <label className="text-tertiary text-[13px] font-bold leading-[16.25px] sm:text-[15px] sm:font-semibold sm:leading-[18.75px] text-gray-700">
        Amount
      </label>
      <div className="flex items-center gap-3">
        {/* Amount Input */}
        <div className="relative flex-1">
          <input
            type="number"
            step="1"
            min="50"
            placeholder="Enter amount (min. 50)"
            {...register("amount", {
              min: {
                value: 50,
                message: "Minimum amount is 50 credit units"
              }
            })}
            className="w-full h-[47px] px-4 text-[15px] font-medium rounded-[15px] transition-all duration-300 ease-in-out
              border border-gray-200 
              hover:border-[#0099FF80] hover:shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-[#0099FF]
              bg-white placeholder:text-gray-400
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            Credit Units
          </div>
        </div>

        {/* Token Selection Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!isConnected}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 
            h-[47px] px-4 rounded-[15px] border border-gray-200
            ${isConnected
              ? "hover:border-[#0099FF80] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] bg-white"
              : "cursor-not-allowed bg-gray-50 opacity-50"
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099FF] focus-visible:border-[#0099FF]`}
        >
          {isConnected ? (
            selectedTokenData ? (
              <>
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] flex items-center justify-center overflow-hidden shadow-sm border border-[#0099FF20]">
                  <Image
                    src={selectedTokenData.image}
                    alt={selectedTokenData.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
                <span className="text-[15px] font-semibold text-gray-900">
                  {selectedTokenData.symbol}
                </span>
              </>
            ) : (
              <span className="text-[15px] font-semibold text-gray-500">
                Select token
              </span>
            )
          ) : (
            <span className="text-[15px] font-semibold text-gray-500">
              Connect Wallet
            </span>
          )}
        </button>
      </div>

      {/* Error Message */}
      {errors.amount && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.amount?.message?.toString()}
          </p>
        </div>
      )}

      {/* Token Selection Modal */}
      {isModalOpen && isConnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-gray-900">
                  Select a Token
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Token List */}
            <div className="p-3 max-h-[400px] overflow-y-auto">
              <div className="space-y-2">
                {paymentTokens.map((token: PaymentToken) => (
                  <div
                    key={token.id}
                    onClick={() => {
                      setSelectedToken(token.id);
                      setIsModalOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-[15px] cursor-pointer transition-all duration-300 ease-in-out 
                      ${selectedToken === token.id
                        ? "bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] border border-[#0099FF]"
                        : "hover:bg-gradient-to-r hover:from-[#0099FF05] hover:to-[#0066FF05] hover:shadow-sm"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0099FF10] to-[#0066FF10] flex items-center justify-center overflow-hidden border border-[#0099FF20]">
                      <Image
                        src={token.image}
                        alt={token.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-gray-900">
                        {token.symbol}
                      </span>
                      <span className="text-sm text-gray-500">{token.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTokenSelector;