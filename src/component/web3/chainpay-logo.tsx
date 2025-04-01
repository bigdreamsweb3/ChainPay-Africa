"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChainPayLogoProps {
  className?: string;
}

export function ChainPayLogo({ className }: ChainPayLogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src="/images/logo-removebg.png"
        alt="ChainPay Logo"
        width={40}
        height={40}
        className="w-full h-full object-contain dark:brightness-110 transition-all duration-300"
        priority
      />
    </div>
  );
} 