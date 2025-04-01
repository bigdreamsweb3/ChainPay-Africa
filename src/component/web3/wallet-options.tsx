"use client";

import { useState, useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { Wallet, CheckCircle } from "lucide-react";
import { useWalletModal } from "@/context/WalletModalContext";
import { Account } from "./account";

interface WalletOptionsProps {
  variant?: "mini" | "full";
}

const buttonVariants = {
  mini: "text-sm px-4 py-2",
  full: "text-base px-4 py-2.5 w-full",
};

const baseButtonStyles =
  "flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark text-white font-medium transition-all duration-300 hover:from-chainpay-blue-dark hover:to-[#3B82F6] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#3B82F6]/20 focus:outline-none dark:from-chainpay-blue-dark dark:to-chainpay-blue-dark/90 dark:hover:from-chainpay-blue-dark/90 dark:hover:to-[#3B82F6] dark:hover:shadow-[#3B82F6]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100 disabled:hover:shadow-none dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:text-white/80 dark:disabled:text-white/80";

export function WalletButton({ variant = "mini" }: WalletOptionsProps) {
  const { isConnected } = useAccount();
  return isConnected ? <Account /> : <WalletOptions variant={variant} />;
}

export function WalletOptions({ variant = "mini" }: WalletOptionsProps) {
  const { isPending } = useConnect();
  const [isClient, setIsClient] = useState(false);
  const { setIsModalOpen, connectionStatus } = useWalletModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isConnecting = isPending || connectionStatus === "connecting";

  const handleClick = () => {
    // Don't open our modal if WalletConnect modal is showing
    if (!isPending) {
      setIsModalOpen(true);
    }
  };

  const renderButtonContent = () => {
    if (connectionStatus === "connecting" || isConnecting) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </>
      );
    } else if (connectionStatus === "error") {
      return (
        <>
          <Wallet className="w-4 h-4" />
          <span className="font-bold">
            {variant === "mini" ? "Connect" : "Connect Wallet"}
          </span>
        </>
      );
    } else if (connectionStatus === "success") {
      return (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>Connected</span>
        </>
      );
    } else if (!isClient) {
      return (
        <>
          <Wallet className="w-4 h-4" />
          <span>Loading...</span>
        </>
      );
    } else {
      return (
        <>
          <Wallet className="w-4 h-4" />
          <span className="font-bold">
            {variant === "mini" ? "Connect" : "Connect Wallet"}
          </span>
        </>
      );
    }
  };

  return (
    <div className={variant === "full" ? "w-full" : "inline-block"}>
      <button
        onClick={handleClick}
        disabled={isConnecting || !isClient}
        className={`${baseButtonStyles} ${buttonVariants[variant]}`}
        aria-label="Connect your wallet to continue"
      >
        {renderButtonContent()}
      </button>
    </div>
  );
}
