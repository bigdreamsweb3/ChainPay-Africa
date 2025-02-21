import BillPaymentForm from "@/component/forms/BillPaymentForm";
import ChainPayInfoCard from "@/component/chainpay-info-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChainPay Africa - Home",
  description:
    "Welcome to ChainPay Africa, your go-to app for seamless bill payments.",
};

export default function Home() {
  return (
    <div className="">
      <ChainPayInfoCard />

      <BillPaymentForm />
    </div>
  );
}
