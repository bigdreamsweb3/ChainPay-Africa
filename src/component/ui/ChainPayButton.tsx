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
        primary:
          "bg-brand-primary text-text-light hover:bg-brand-secondary border border-brand-primary",
        secondary:
          "bg-bg-primary text-text-primary hover:bg-bg-secondary border border-border-light",
        accent:
          "bg-brand-accent text-text-light hover:bg-[#F97316] border border-brand-accent",
        outline:
          "border border-border-light bg-transparent hover:bg-bg-secondary text-text-primary",
        ghost: "bg-transparent text-text-primary hover:bg-bg-secondary",
        destructive:
          "bg-[#EF4444] text-text-light hover:bg-[#DC2626] border border-[#EF4444]",
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
