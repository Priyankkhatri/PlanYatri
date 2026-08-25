'use client';

import React, { useState } from 'react';
import { StyleCard } from '@/components/travel-style/StyleCard';
export default function TravelStylePage() {
  const [selected, setSelected] = useState('luxury');

  return (
    <div className="travel-style-container">
      <h2>Select Your Travel Persona</h2>
      <div className="style-cards-grid">
        {['Luxury & Wellness', 'Culture & Heritage', 'Nature & Expedition', 'Culinary & Wine'].map((style) => (
          <StyleCard key={style} title={style} selected={selected === style} onSelect={() => setSelected(style)} />
        ))}
      </div>
    </div>
  );
}
