"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useAccount } from "wagmi";
import { AlertCircle } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount();

  const selectedTokenData = paymentTokens.find(
    (token) => token.id === selectedToken
  );

  return (
    <div className="space-y-3 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <label className="text-sm font-medium text-gray-700">
        Amount
      </label>
      <div className="flex items-center gap-2">
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
            className="w-full h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
              border border-gray-300 
              hover:border-blue-500 hover:shadow-sm
              focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
              bg-white placeholder:text-gray-400
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            Credit Units
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!isConnected}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 
            h-10 px-3 rounded-lg border border-gray-300
            ${isConnected
              ? "hover:border-blue-500 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] bg-white"
              : "cursor-not-allowed bg-gray-100 opacity-50"
            }
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500`}
        >
          {isConnected ? (
            selectedTokenData ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden shadow-sm border border-blue-200">
                  <Image
                    src={selectedTokenData.image}
                    alt={selectedTokenData.name}
                    width={24}
                    height={24}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTokenData.symbol}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                Select token
              </span>
            )
          ) : (
            <span className="text-sm font-medium text-gray-500">
              Connect Wallet
            </span>
          )}
        </button>
      </div>

      {errors.amount && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.amount?.message?.toString()}
          </p>
        </div>
      )}

      {isModalOpen && isConnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Select a Token
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
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

            <div className="p-2 max-h-[400px] overflow-y-auto">
              <div className="space-y-1">
                {paymentTokens.map((token: PaymentToken) => (
                  <div
                    key={token.id}
                    onClick={() => {
                      setSelectedToken(token.id);
                      setIsModalOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out 
                      ${selectedToken === token.id
                        ? "bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-500"
                        : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-sm"
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden border border-blue-200">
                      <Image
                        src={token.image}
                        alt={token.name}
                        width={32}
                        height={32}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {token.symbol}
                      </span>
                      <span className="text-xs text-gray-500">{token.name}</span>
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