'use client';

import React from 'react';
export const SOSButton: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => {
  return (
    <button className="sos-button" onClick={onTrigger}>
      SOS
    </button>
  );
};
