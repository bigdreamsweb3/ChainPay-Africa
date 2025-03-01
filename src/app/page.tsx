import BillPaymentForm from "@/component/forms/BillPaymentForm";
import ChainPayInfoCard from "@/component/chainpay-info-card";
import type { Metadata } from "next";
// import { isTokenAccepted } from "@/interact/TokenCheck";

export const metadata: Metadata = {
  title: "ChainPay Africa - Pay Bills with Crypto",
  description:
    "ChainPay Africa is a blockchain-powered payment platform that lets you pay for airtime, data, electricity, and other services using USDC or BNB on Binance Smart Chain. Enjoy fast, secure, and borderless transactions.",
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-2.5 sm:gap-5">
        <ChainPayInfoCard />
        <BillPaymentForm />
      </div>
    </>
  );
}
