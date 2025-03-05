"use client"; // Ensure it's a Client Component

import { useReadContract, useWalletClient, useWriteContract } from "wagmi";
import contractArtifact from "../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";

// ERC20 Standard token ABI
const defaultTokenABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_spender",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    // Other ERC-20 functions...
];

const abi = contractArtifact.abi; // Extract only the ABI array
const CONTRACT_ADDRESS = "0xdfc211dd46a168ac0352b149ad8bf49ff24716dd";
const TOKEN_ADDRESS = "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff";

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
    const { data: walletClient } = useWalletClient();
    const { writeContract, isPending, error, data } = useWriteContract();

    const buyAirtime = async (phoneNumber, amount, network, tokenAddress) => {
        if (!walletClient) {
            console.error("Wallet not connected.");
            return;
        }

        try {
            // Set fixed low gas parameters based on successful historical transactions
            const optimizedGasOptions = {
                maxFeePerGas: BigInt(1500000000),         // 1.5 Gwei
                maxPriorityFeePerGas: BigInt(1000000000), // 1.0 Gwei
                gas: BigInt(100000),                      // Fixed gas limit
            };

            console.log(amount);

            const result = writeContract({
                abi,
                address: CONTRACT_ADDRESS,
                functionName: "buyAirtime",
                args: [phoneNumber, amount, network, tokenAddress],
                account: walletClient.account,
                ...optimizedGasOptions
            });
            return result;
        } catch (err) {
            console.error("Error buying airtime:", err);
        }
    };

    return { buyAirtime, isPending, error, data };
}

export function useTokenApproval() {
    const { data: walletClient } = useWalletClient();
    const { writeContract, isPending, error, data } = useWriteContract();

    const approve = async (token_address, amount, spender) => {
        if (!walletClient) {
            console.error("Wallet not connected.");
            return;
        }

        try {
            // Use same optimized gas parameters for approval
            const optimizedGasOptions = {
                maxFeePerGas: BigInt(1500000000),         // 1.5 Gwei
                maxPriorityFeePerGas: BigInt(1000000000), // 1.0 Gwei
                gas: BigInt(70000),                       // Lower gas limit for approvals
            };

            const result = writeContract({
                abi: defaultTokenABI,
                address: token_address,
                functionName: "approve",
                args: [spender, amount],
                account: walletClient.account,
                ...optimizedGasOptions
            });
            return result;
        } catch (err) {
            console.error("Error approving token:", err);
        }
    };

    return { approve, isPending, error, data };
}