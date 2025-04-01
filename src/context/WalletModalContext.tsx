"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WalletModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  connectionStatus: "idle" | "connecting" | "success" | "error";
  setConnectionStatus: (status: "idle" | "connecting" | "success" | "error") => void;
  selectedConnector: string | null;
  setSelectedConnector: (connector: string | null) => void;
}

const WalletModalContext = createContext<WalletModalContextType | undefined>(undefined);

export function WalletModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle");
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  return (
    <WalletModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        connectionStatus,
        setConnectionStatus,
        selectedConnector,
        setSelectedConnector,
      }}
    >
      {children}
    </WalletModalContext.Provider>
  );
}

export function useWalletModal() {
  const context = useContext(WalletModalContext);
  if (context === undefined) {
    throw new Error("useWalletModal must be used within a WalletModalProvider");
  }
  return context;
} 