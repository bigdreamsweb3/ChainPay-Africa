"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-chainpay-orange/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-chainpay-orange text-white hover:bg-chainpay-orange/90 border border-chainpay-orange shadow-sm hover:shadow-md",
        secondary:
          "bg-white text-chainpay-orange hover:bg-chainpay-orange/5 border border-chainpay-orange/20 shadow-sm hover:shadow-md",
        accent:
          "bg-gradient-to-r from-chainpay-orange to-chainpay-orange/90 text-white hover:from-chainpay-orange/90 hover:to-chainpay-orange/80 border border-chainpay-orange shadow-sm hover:shadow-md",
        outline:
          "border border-chainpay-orange/20 bg-transparent hover:bg-chainpay-orange/5 text-chainpay-orange",
        ghost: 
          "bg-transparent text-chainpay-orange hover:bg-chainpay-orange/5",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 border border-red-500 shadow-sm hover:shadow-md",
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
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      isLoading,
      icon,
      whileHover,
      whileTap,
      ...props
    },
    ref
  ) => {
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
