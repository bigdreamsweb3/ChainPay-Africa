"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-primary text-white hover:shadow-lg active:scale-[0.98] border border-transparent",
        secondary:
          "bg-white text-chainpay-blue hover:bg-chainpay-blue-light/10 border border-chainpay-blue-light/20 shadow-sm hover:shadow-md",
        accent:
          "bg-gradient-secondary text-text-primary hover:shadow-lg active:scale-[0.98] border border-transparent",
        outline:
          "border border-chainpay-blue/20 bg-transparent hover:bg-chainpay-blue-light/5 text-chainpay-blue",
        ghost: 
          "bg-transparent text-chainpay-blue hover:bg-chainpay-blue-light/5",
        destructive:
          "bg-status-error text-white hover:bg-status-error/90 border border-transparent shadow-sm hover:shadow-md",
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
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
