"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark text-white hover:from-chainpay-blue-dark hover:to-chainpay-blue-darker shadow-md border border-chainpay-blue-dark",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 border border-slate-300",
        accent: "bg-gradient-to-r from-chainpay-orange to-chainpay-orange-dark text-white hover:from-chainpay-orange-dark hover:to-chainpay-orange-darker shadow-md border border-chainpay-orange-dark",
        highlight: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md border border-amber-600",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md border border-red-700",
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-4",
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

export interface FuturisticButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const FuturisticButton = React.forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ className, children, variant, size, fullWidth, isLoading, icon, whileHover, whileTap, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={whileHover || { scale: 1.02 }}
        whileTap={whileTap || { scale: 0.98 }}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          "group relative overflow-hidden",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {/* Background glow effect */}
        <span
          className="absolute inset-0 bg-gradient-to-r from-chainpay-blue/20 via-chainpay-blue-light/20 to-chainpay-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        />
        
        {/* Animated sparkle effect on hover */}
        <span className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="col-span-1 row-span-1 bg-white/10 rounded-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700"
              style={{
                width: '4px',
                height: '4px',
                transform: 'translate(-50%, -50%)',
                left: `${(i % 3) * 50 + 25}%`,
                top: `${Math.floor(i / 3) * 50 + 25}%`,
                transitionDelay: `${(i * 50)}ms`,
              }}
            />
          ))}
        </span>
        
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

FuturisticButton.displayName = "FuturisticButton";

export default FuturisticButton; 