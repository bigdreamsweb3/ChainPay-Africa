"use client"; // Ensure it's a Client Component

import { useReadContract, useWalletClient, useWriteContract } from "wagmi";
import contractArtifact from "../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";
// import { ethers } from "ethers";

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
export const CONTRACT_ADDRESS = "0x63d25E6a30c30F2499c8f3d52bEf5fDE8e804066";
export const TOKEN_ADDRESS = "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897";

// Hook to check if token is accepted
export const useIsTokenAccepted = (tokenAddress) => {
  const { data, error, isLoading } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "acceptedTokens",
    args: [tokenAddress],
  });

  if (isLoading) return "Loading...";
  if (error) return `Error: ${error.message}`;
  return data;
};

// Hook to check token allowance
export const useTokenAllowance = (tokenAddress, owner, spender) => {
  const { data, error, isLoading } = useReadContract({
    abi: defaultTokenABI,
    address: tokenAddress,
    functionName: "allowance",
    args: [owner, spender],
    enabled: !!tokenAddress && !!owner && !!spender,
  });

  return { allowance: data, error, isLoading };
};

// Custom hook to buy airtime
export function useBuyAirtime() {
  const { data: walletClient } = useWalletClient();
  const { writeContract, isPending, error, data } = useWriteContract();

  const buyAirtime = async (
    phoneNumber,
    amount,
    network,
    tokenAddress,
    tokenSymbol,
    onStatusUpdate
  ) => {
    if (!walletClient) {
      throw new Error("Wallet not connected");
    }

    try {
      // Request approval first
      onStatusUpdate?.("approving");
      const approveTx = await writeContract({
        abi: defaultTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, BigInt(amount)],
        account: walletClient.account,
      });

      // Wait for approval transaction to be mined
      onStatusUpdate?.("waiting_approval");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for approval to be mined

      // Now proceed with the airtime purchase
      onStatusUpdate?.("purchasing");
      const purchaseTx = await writeContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "buyAirtime",
        args: [phoneNumber, BigInt(amount), network, tokenAddress],
        account: walletClient.account,
      });

      // Wait for purchase transaction to be mined
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for purchase to be mined

      onStatusUpdate?.("completed");
      return purchaseTx;
    } catch (err) {
      console.error("Error buying airtime:", err);
      onStatusUpdate?.("error");

      if (err.code === 4001) {
        throw new Error("Transaction was rejected in wallet");
      } else if (err.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for gas or transaction");
      } else if (err.message?.includes("execution reverted")) {
        throw new Error(
          "Transaction reverted by the contract - check input parameters"
        );
      }
      throw new Error(err.message || "Failed to process transaction");
    }
  };

  return { buyAirtime, isPending, error, data };
}

// Custom hook for token approval
export function useTokenApproval() {
  const { data: walletClient } = useWalletClient();
  const { writeContract, isPending, error, data } = useWriteContract();

  const approve = async (tokenAddress, amount, spender, onStatusUpdate) => {
    if (!walletClient) {
      throw new Error("Wallet not connected");
    }

    try {
      onStatusUpdate?.("approving");
      const result = await writeContract({
        abi: defaultTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, BigInt(amount)],
        account: walletClient.account,
      });

      onStatusUpdate?.("completed");
      return result;
    } catch (err) {
      console.error("Error approving token:", err);
      onStatusUpdate?.("error");

      if (err.code === 4001) {
        throw new Error("Approval rejected in wallet");
      } else if (err.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for gas");
      } else if (err.message?.includes("execution reverted")) {
        throw new Error("Approval reverted by the token contract");
      }
      throw new Error(err.message || "Failed to approve token");
    }
  };

  return { approve, isPending, error, data };
}
