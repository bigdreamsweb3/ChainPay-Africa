import BillPaymentForm from "@/component/forms/BillPaymentForm";

import ChainPayInfoCard from "@/component/chainpay-info-card";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-5">
      <ChainPayInfoCard />

      <BillPaymentForm />
    </div>
  );
}
