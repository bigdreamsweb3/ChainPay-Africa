"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#60A5FA]/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#60A5FA] text-[#FFFFFF] hover:bg-[#3B82F6] border border-[#60A5FA]",
        secondary: "bg-[#FFFFFF] text-[#1E293B] hover:bg-[#F1F5F9] border border-[#E2E8F0]",
        accent: "bg-[#FF9900] text-[#FFFFFF] hover:bg-[#F97316] border border-[#FF9900]",
        outline: "border border-[#E2E8F0] bg-transparent hover:bg-[#F1F5F9] text-[#1E293B]",
        ghost: "bg-transparent text-[#1E293B] hover:bg-[#F1F5F9]",
        destructive: "bg-[#EF4444] text-[#FFFFFF] hover:bg-[#DC2626] border border-[#EF4444]",
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-4 text-sm",
        large: "h-12 px-6 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      fullWidth: false,
    },
  }
);

export interface ChainPayButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ChainPayButton = React.forwardRef<HTMLButtonElement, ChainPayButtonProps>(
  ({ className, children, variant, size, fullWidth, isLoading, icon, whileHover, whileTap, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={whileHover || { scale: 1.02 }}
        whileTap={whileTap || { scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : icon ? (
            <span className="mr-1">{icon}</span>
          ) : null}
          {children}
        </span>
      </motion.button>
    );
  }
);

ChainPayButton.displayName = "ChainPayButton";

export default ChainPayButton;