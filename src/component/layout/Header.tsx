"use client"

import Image from "next/image"
import { useAccount } from "wagmi"
import { Account } from "@/component/web3/account"
import { WalletOptions } from "@/component/web3/wallet-options"
import { MapPin } from "lucide-react"

function ConnectWallet() {
  const { isConnected } = useAccount()
  return isConnected ? <Account /> : <WalletOptions />
}

export function Header() {
  return (
    <header className="py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src="/logo.jpg"
                alt="ChainPay"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                priority
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="bg-green-500 w-2.5 h-2.5 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Chain<span className="text-brand-secondary">Pay</span>
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                <span>Africa</span>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}

