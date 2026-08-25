'use client';
import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function VelocityPulse({ size = 'md', label = 'LIVE TELEMETRY SYNC' }: Props) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className={`absolute rounded-full bg-[#4D41DF]/20 animate-ping ${sizeClasses[size]}`} />
        {/* Middle accent pulse */}
        <div className={`absolute rounded-full bg-[#D4A843]/30 animate-pulse delay-300 ${sizeClasses[size]}`} />
        {/* Core telemetry emblem */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-[#18181B] border-2 border-[#D4A843] flex items-center justify-center shadow-xl">
          <div className="w-4 h-4 rounded-full bg-[#4D41DF] animate-bounce" />
        </div>
      </div>
      {label && (
        <span className="text-xs font-mono font-bold tracking-widest text-[#D4A843] uppercase animate-pulse">
          ⚡ {label}
        </span>
      )}
    </div>
  );
}
