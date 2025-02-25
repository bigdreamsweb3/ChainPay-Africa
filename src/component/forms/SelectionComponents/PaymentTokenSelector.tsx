"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";

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
  const { register } = useFormContext();
  const defaultLogo = "/images/logo.jpg"; // Path to your local fallback logo

  // Create a state to hold image sources for each token
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>(
    paymentTokens.reduce((acc, token) => {
      acc[token.id] = token.image; // Initialize with token images
      return acc;
    }, {} as { [key: string]: string })
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-tertiary text-[13px] font-bold leading-[16.25px]">
          Select Payment Token
        </label>

        {paymentTokens.length === 0 ? (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
            <p>
              No supported payment tokens available for the connected network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {paymentTokens.map((token: PaymentToken) => (
              <div key={token.id} className="w-full">
                <input
                  type="radio"
                  id={token.id}
                  value={token.id}
                  {...register("paymentToken")}
                  className="sr-only"
                  onChange={() => setSelectedToken(token.id)}
                />
                <label
                  htmlFor={token.id}
                  className={`block w-full rounded-xl shadow-sm transition-all duration-200 ease-in-out cursor-pointer ${
                    selectedToken === token.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="p-2 items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Image
                          src={imageSources[token.id]}
                          alt={token.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full"
                          onError={() => {
                            setImageSources((prev) => ({
                              ...prev,
                              [token.id]: defaultLogo,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-gray-800">
                          {token.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {token.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTokenSelector;