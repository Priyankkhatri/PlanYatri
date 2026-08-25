'use client';

import React from 'react';

interface Props {
  onTrigger: () => void;
  isDispatching?: boolean;
}

export const SOSButton: React.FC<Props> = ({ onTrigger, isDispatching }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulsing red wave */}
      <div className="absolute w-44 h-44 rounded-full bg-red-500/20 animate-ping" />
      <div className="absolute w-36 h-36 rounded-full bg-red-500/30 animate-pulse" />
      
      {/* Interactive Core SOS Button */}
      <button
        onClick={onTrigger}
        disabled={isDispatching}
        className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-red-700 to-red-500 text-white font-extrabold text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center border-4 border-white cursor-pointer"
      >
        <span>{isDispatching ? 'SYNC...' : 'SOS'}</span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-red-200">
          {isDispatching ? 'DISPATCHING' : 'HOLD 3 SEC'}
        </span>
      </button>
    </div>
  );
};
