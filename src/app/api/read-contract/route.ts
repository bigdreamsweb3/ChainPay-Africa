import { crossfiTestnet } from "@/utils/web3/chains";
import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import abiFile from "../../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";
import { CONTRACT_ADDRESSES } from "@/app-config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tokenAddress = searchParams.get('token');

  if (!tokenAddress) {
    return NextResponse.json({ message: "Token address is required" }, { status: 400 });
  }

  try {
    const contractAddress = CONTRACT_ADDRESSES.AIRTIME;

    const client = createPublicClient({
      chain: crossfiTestnet,
      transport: http(),
    });

    const result = await client.readContract({
      abi: abiFile.abi,
      address: contractAddress,
      functionName: "acceptedTokens",
      args: [tokenAddress],
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message; // Type assertion to Error
    return NextResponse.json({
      message: "Failed to fetch contract data",
      error: errorMessage,
    }, { status: 500 });
  }
}