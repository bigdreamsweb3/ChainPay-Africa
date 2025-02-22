import { NextResponse } from "next/server";
import { detectCarrier } from "@/utils/getPhoneCarrierInfo";

export async function GET(req: Request) {
  console.log("Request received:", req.method);

  try {
    const url = new URL(req.url); // Create a URL object from the request
    const phoneNumber = url.searchParams.get("phoneNumber"); // Get the phoneNumber from query parameters

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    const phoneNumberCarrier = detectCarrier(phoneNumber);
    return NextResponse.json({ phoneNumberCarrier }, { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
