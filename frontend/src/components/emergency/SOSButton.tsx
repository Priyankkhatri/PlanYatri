'use client';
import React from 'react';

export const SOSButton = ({ onTrigger }: { onTrigger: () => void }) => {
  return (
    <button className="sos-button shadow-xl hover:scale-105 transition-transform" onClick={onTrigger}>
      SOS
    </button>
  );
};
