import BillPaymentForm from "@/component/forms/BillPaymentForm";
import ChainPayInfoCard from "@/component/chainpay-info-card";
import type { Metadata } from "next";
// import { isTokenAccepted } from "@/interact/TokenCheck";

export const metadata: Metadata = {
  title: "ChainPay Africa - Home",
  description:
    "Welcome to ChainPay Africa, your go-to app for seamless bill payments.",
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
