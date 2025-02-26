import { crossfiTestnet } from "@/utils/web3/chains";
import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import abiFile from "../../../../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tokenAddress = searchParams.get('token');

  if (!tokenAddress) {
    return NextResponse.json({ message: "Token address is required" }, { status: 400 });
  }

  try {
    const contractAddress = "0x101c154ec2b82fbd05768546fef19bd3ef9c37b5"; // Your contract address

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