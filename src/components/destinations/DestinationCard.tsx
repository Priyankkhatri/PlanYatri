import React from 'react';
import { Destination } from '@/types';
export const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  return (
    <div className="dest-card">
      <img src={destination.image} alt={destination.name} />
      <div className="dest-info">
        <h3>{destination.name}</h3>
        <p style={{ color: '#8C867A', fontSize: 13 }}>{destination.country}</p>
      </div>
    </div>
  );
};
