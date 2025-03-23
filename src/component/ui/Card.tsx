"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  icon, 
  children, 
  onClick,
  className = "" 
}) => {
  return (
    <motion.div
      className={`relative bg-background-card rounded-medium border border-border-light shadow-small overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { y: -2, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.05)" } : {}}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Card content */}
      <div className="p-5">
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="w-8 h-8 rounded-circle flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                {icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          </div>
        </div>

        {/* Card body */}
        <div className="relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default Card; 