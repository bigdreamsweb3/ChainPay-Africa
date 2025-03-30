"use client"; // Ensure it's a Client Component

import { useReadContract, useWalletClient, useWriteContract, usePublicClient } from "wagmi";
import contractArtifact from "../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";

// ERC20 Standard token ABI
const defaultTokenABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

const abi = contractArtifact.abi;
export const AIRTIME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AIRTIME_CONTRACT_ADDRESS as `0x${string}`;
export const DATA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DATA_CONTRACT_ADDRESS as `0x${string}`;
export const USDC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS as `0x${string}`;
export const USDT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS as `0x${string}`;

// Type definitions
type Network = 0 | 1 | 2 | 3; // MTN=0, Airtel=1, Glo=2, Etisalat=3
type Status = "approving" | "waiting_approval" | "purchasing" | "completed" | "error";

// Add these type definitions at the top with other types
type WalletError = {
  code: number;
  message: string;
  data?: unknown;
  transaction?: unknown;
};

type ContractError = {
  code: string;
  message: string;
  data?: unknown;
  transaction?: unknown;
};

// Hook to check if token is accepted
export const useIsTokenAccepted = (tokenAddress: `0x${string}` | undefined) => {
  const { data, error, isLoading } = useReadContract({
    abi,
    address: AIRTIME_CONTRACT_ADDRESS,
    functionName: "acceptedTokens",
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });

  if (isLoading) return { isAccepted: undefined, isLoading: true, error: null };
  if (error) return { isAccepted: undefined, isLoading: false, error };
  return { isAccepted: data as boolean, isLoading: false, error: null };
};

// Hook to check token allowance
export const useTokenAllowance = (
  tokenAddress: `0x${string}` | undefined,
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined
) => {
  const { data, error, isLoading } = useReadContract({
    abi: defaultTokenABI,
    address: tokenAddress,
    functionName: "allowance",
    args: [owner, spender],
    query: {
      enabled: !!tokenAddress && !!owner && !!spender,
    },
  });

  return { 
    allowance: data as bigint | undefined, 
    error, 
    isLoading 
  };
};

// Custom hook to buy airtime
export function useBuyAirtime() {
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync, isPending, error: writeError, data } = useWriteContract();
  const publicClient = usePublicClient(); // Add public client for waiting on transactions

  const buyAirtime = async (
    phoneNumber: string,
    amount: string | bigint,
    network: Network,
    tokenAddress: `0x${string}`,
    tokenSymbol: string,
    onStatusUpdate?: (status: Status) => void
  ) => {
    if (!walletClient || !publicClient) {
      throw new Error("Wallet or public client not connected");
    }

    try {
      // Request approval first
      onStatusUpdate?.("approving");
      const approveTxHash = await writeContractAsync({
        abi: defaultTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [AIRTIME_CONTRACT_ADDRESS, BigInt(amount)],
      });

      // Wait for approval transaction to be confirmed
      onStatusUpdate?.("waiting_approval");
      const approvalReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTxHash,
      });

      if (approvalReceipt.status !== "success") {
        throw new Error("Approval transaction failed");
      }

      // Proceed with airtime purchase
      onStatusUpdate?.("purchasing");
      const purchaseTxHash = await writeContractAsync({
        abi,
        address: AIRTIME_CONTRACT_ADDRESS,
        functionName: "buyAirtime",
        args: [phoneNumber, BigInt(amount), network, tokenAddress],
      });

      // Wait for purchase transaction to be confirmed
      const purchaseReceipt = await publicClient.waitForTransactionReceipt({
        hash: purchaseTxHash,
      });

      if (purchaseReceipt.status === "success") {
        onStatusUpdate?.("completed");
        return purchaseTxHash;
      } else {
        throw new Error("Purchase transaction failed");
      }
    } catch (err) {
      console.error("Error buying airtime:", err);
      onStatusUpdate?.("error");
      
      const error = err as WalletError | ContractError;
      if (error.code === 4001) {
        throw new Error("Transaction was rejected in wallet");
      } else if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for gas or transaction");
      } else if (error.message?.includes("execution reverted")) {
        throw new Error("Transaction reverted - check input parameters");
      }
      throw new Error(error.message || "Failed to process transaction");
    }
  };

  return { 
    buyAirtime, 
    isPending, 
    error: writeError, 
    data 
  };
}

// Custom hook for token approval
export function useTokenApproval() {
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync, isPending, error: writeError, data } = useWriteContract();
  const publicClient = usePublicClient(); // Add public client for potential future use

  const approve = async (
    tokenAddress: `0x${string}`,
    amount: string | bigint,
    spender: `0x${string}`,
    onStatusUpdate?: (status: Status) => void
  ) => {
    if (!walletClient || !publicClient) {
      throw new Error("Wallet or public client not connected");
    }

    try {
      onStatusUpdate?.("approving");
      const txHash = await writeContractAsync({
        abi: defaultTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, BigInt(amount)],
      });

      // Optionally wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === "success") {
        onStatusUpdate?.("completed");
        return txHash;
      } else {
        throw new Error("Approval transaction failed");
      }
    } catch (err) {
      console.error("Error approving token:", err);
      onStatusUpdate?.("error");

      const error = err as WalletError | ContractError;
      if (error.code === 4001) {
        throw new Error("Approval rejected in wallet");
      } else if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for gas");
      } else if (error.message?.includes("execution reverted")) {
        throw new Error("Approval reverted by the token contract");
      }
      throw new Error(error.message || "Failed to approve token");
    }
  };

  return { 
    approve, 
    isPending, 
    error: writeError, 
    data 
  };
}