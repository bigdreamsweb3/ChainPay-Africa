"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { Account } from "@/component/web3/account";
import { WalletOptions } from "@/component/web3/wallet-options";
import { MapPin } from "lucide-react";
import { appConfig } from "@/app-config";

function ConnectWallet() {
  const { isConnected } = useAccount();
  return isConnected ? <Account /> : <WalletOptions />;
}

export function Header() {
  return (
    <header className="py-2 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src={appConfig.appLogo}
                alt="ChainPay"
                width={32}
                height={32}
                className="w-8 h-8 sm:w-8 sm:h-8 rounded-full"
                priority
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                <div className="bg-green-500 w-1.5 h-1.5 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {appConfig.appName}
                <span className="text-brand-secondary">
                  {appConfig.appSubName}
                </span>
              </span>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                <MapPin size={12} />
                <span>{appConfig.appRegion}</span>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex-shrink-0">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
}

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         {/* Smooth Section */}
//         <section className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Smooth</h1>
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Arrime</h2>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-700">Data</span>
//                 <span className="text-gray-500">Set</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-700">TV</span>
//                 <span className="text-gray-500">Utility</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Phone Number Section */}
//         <section className="mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Phone Number</h2>
//             <input
//               type="text"
//               placeholder="Enter phone number"
//               className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
//             />
//           </div>
//         </section>

//         {/* Token Section */}
//         <section className="mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Token</h2>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-700 font-medium">bNGN</span>
//                 <span className="text-gray-500">USDC</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-700 font-medium">KIN</span>
//                 <span className="text-gray-500">USDT</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Amount Section */}
//         <section className="mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Amount</h2>
//             <input
//               type="text"
//               placeholder="Enter amount"
//               className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
//             />
//           </div>
//         </section>

//         {/* Connect Wallet Section */}
//         <section className="mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Connect Wallet</h2>
//             <div className="text-sm text-gray-500">Powered by Solana</div>
//           </div>
//         </section>

//         {/* Chat Section */}
//         <section className="mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat with us</h2>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }