import BillPaymentForm from "@/component/forms/BillPaymentForm";
import WalletOverview from "@/component/WalletOverview";

// import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-5">
      <WalletOverview />
      <BillPaymentForm />
    </div>
  );
}
