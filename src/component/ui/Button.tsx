"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  // Define variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white',
    secondary: 'bg-background-card border border-brand-primary text-brand-primary',
    accent: 'bg-gradient-to-r from-brand-accent to-brand-highlight text-white',
    outline: 'bg-transparent border border-border-medium text-text-primary hover:border-brand-primary hover:text-brand-primary',
  };

  // Define size styles
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-5 text-lg',
  };

  // Determine if button is in a non-interactive state
  const isNonInteractive = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isNonInteractive}
      className={`
        relative rounded-pill shadow-small ${variantStyles[variant]} font-medium
        ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} 
        transition-all duration-300 focus:outline-none
        ${isNonInteractive ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-medium'}
        ${className}
      `}
      whileHover={!isNonInteractive ? { scale: 1.02 } : {}}
      whileTap={!isNonInteractive ? { scale: 0.98 } : {}}
    >
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : icon ? (
          <span className="flex items-center justify-center">{icon}</span>
        ) : null}
        {children}
      </div>
    </motion.button>
  );
};

export default Button; 