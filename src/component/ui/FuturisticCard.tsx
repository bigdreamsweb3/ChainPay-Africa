"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Zap, Star } from 'lucide-react';

interface FuturisticCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  glowColor?: string;
  onClick?: () => void;
}

const FuturisticCard: React.FC<FuturisticCardProps> = ({ 
  title, 
  icon, 
  children, 
  glowColor = "rgba(0, 153, 255, 0.5)", 
  onClick 
}) => {
  // Random position for sparkles
  const sparklePositions = [
    { top: '10%', right: '10%' },
    { top: '70%', right: '15%' },
    { top: '30%', right: '85%' },
  ];

  return (
    <motion.div
      className="relative space-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-medium overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -inset-1 opacity-30"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['100% 0%', '-100% 0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Card content */}
      <div className="relative p-5 z-10">
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon ? (
              <div className="w-8 h-8 rounded-circle flex items-center justify-center bg-gradient-to-r from-chainpay-blue to-chainpay-blue-light text-white">
                {icon}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-circle flex items-center justify-center bg-gradient-to-r from-chainpay-blue to-chainpay-blue-light text-white">
                <Rocket className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          </div>

          {/* Animated star */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-chainpay-orange"
          >
            <Star className="w-5 h-5 fill-chainpay-orange" />
          </motion.div>
        </div>

        {/* Card body */}
        <div className="relative">
          {children}

          {/* Sparkle effects */}
          {sparklePositions.map((pos, index) => (
            <motion.div
              key={index}
              className="absolute pointer-events-none"
              style={{ ...pos }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              <Sparkles className="w-4 h-4 text-chainpay-orange" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FuturisticCard; 