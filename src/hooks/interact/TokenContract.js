"use client"; // Ensure it's a Client Component

import { useReadContract, useWriteContract } from "wagmi";
import contractArtifact from "../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";

const abi = contractArtifact.abi; // Extract only the ABI array
const CONTRACT_ADDRESS = "0x101c154ec2b82fbd05768546fef19bd3ef9c37b5";
const TOKEN_ADDRESS = "0xea26a662333a2a5E87fB6851fc24a47fa53d98D1";

// Convert this into a custom hook
export const useIsTokenAccepted = () => {
    const { data, error, isLoading } = useReadContract({
        abi, // Corrected ABI format
        address: CONTRACT_ADDRESS,
        functionName: "acceptedTokens",
        args: [TOKEN_ADDRESS], // Add the required address argument
    });

    if (isLoading) return "Loading...";
    if (error) return `Error: ${error.message}`;

    return data;
};

// Custom hook to buy airtime
export function useBuyAirtime() {
    const { writeContract, isPending, error, data } = useWriteContract();

    const buyAirtime = async(phoneNumber, amount, network, tokenAddress) => {
        try {
            const result = writeContract({
                abi,
                address: CONTRACT_ADDRESS,
                functionName: "buyAirtime",
                args: [phoneNumber, amount, network, tokenAddress],
            });
            return result;
        } catch (err) {
            console.error("Error buying airtime:", err);
        }
    };

    return { buyAirtime, isPending, error, data }; // Ensure this returns an object
}

// Custom hook for token approval
export function useTokenApproval() {
    const { writeContract } = useWriteContract();

    const approve = async(tokenAddress, amount, spender) => {
        try {
            await writeContract({
                abi,
                address: tokenAddress,
                functionName: "approve",
                args: [spender, amount],
            });
        } catch (err) {
            console.error("Error approving token:", err);
        }
    };

    return { approve };
};

// const { approve } = useTokenApproval();

// // Call approve when needed
// await approve(TOKEN_ADDRESS, amount, spender);