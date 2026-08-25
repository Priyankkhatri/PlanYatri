'use client';

import React from 'react';
import '@/styles/Emergency.css';

export const SOSButton: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => {
  return (
    <button className="sos-button" onClick={onTrigger}>
      SOS
    </button>
  );
};
