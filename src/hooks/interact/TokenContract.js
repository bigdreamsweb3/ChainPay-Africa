"use client"; // Ensure it's a Client Component

import { useReadContract, useWalletClient, useWriteContract } from "wagmi";
import contractArtifact from "../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";

// ERC20 Standard token ABI (unchanged)
const defaultTokenABI = [ /* ... same as before ... */ ];

const abi = contractArtifact.abi;
export const CONTRACT_ADDRESS = "0x2E88a1AD457AD36C4738E487c941413bEA9a3aCd";
export const TOKEN_ADDRESS = "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff";

// Hook to check if token is accepted (unchanged)
export const useIsTokenAccepted = () => {
  const { data, error, isLoading } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "acceptedTokens",
    args: [TOKEN_ADDRESS],
  });

  if (isLoading) return "Loading...";
  if (error) return `Error: ${error.message}`;
  return data;
};

// Custom hook to buy airtime
export function useBuyAirtime() {
  const { data: walletClient } = useWalletClient();
  const { writeContract, isPending, error, data } = useWriteContract();
  const { data: balance } = useReadContract({
    abi: defaultTokenABI,
    address: TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: [walletClient?.account],
    enabled: !!walletClient?.account,
  });

  const buyAirtime = async (phoneNumber, amount, network, tokenAddress, tokenSymbol) => {
    if (!walletClient) {
      throw new Error("Wallet not connected");
    }

    if (!balance || BigInt(balance) < BigInt(amount)) {
      throw new Error(
        `Insufficient ${tokenSymbol} balance in wallet. Please ensure you have enough ${tokenSymbol} tokens.`
      );
    }

    try {
      console.log("BuyAirtime parameters:", {
        currentBalance: balance?.toString(),
        requiredAmount: amount.toString(),
        tokenSymbol,
        tokenAddress,
        network
      });

      const result = await writeContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "buyAirtime",
        args: [phoneNumber, BigInt(amount), network, tokenAddress],
        account: walletClient.account,
        // Gas options removed - will be automatically estimated
      });

      return result;
    } catch (err) {
      console.error("Error buying airtime:", err);
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

  return { buyAirtime, isPending, error, data, balance };
}

// Custom hook for token approval
export function useTokenApproval() {
  const { data: walletClient } = useWalletClient();
  const { writeContract, isPending, error, data } = useWriteContract();

  const approve = async (tokenAddress, amount, spender) => {
    if (!walletClient) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await writeContract({
        abi: defaultTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, BigInt(amount)],
        account: walletClient.account,
        // Gas options removed - will be automatically estimated
      });

      return result;
    } catch (err) {
      console.error("Error approving token:", err);
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