'use client';

import React from 'react';

export const InteractiveMap: React.FC<{ lat?: number; lng?: number }> = ({ lat = 46.8182, lng = 8.2275 }) => {
  return (
    <div style={{ width: '100%', height: 350, background: '#E4E4E7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
      <span style={{ fontWeight: 600, color: '#52525B' }}>Interactive Map Visualizer ({lat}, {lng})</span>
    </div>
  );
};
