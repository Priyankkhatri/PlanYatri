import React from 'react';
import { Trip } from '@/types';

export const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <div style={{ background: '#FFF', padding: 16, borderRadius: 12, border: '1px solid #EFEAE2' }}>
      <h4>{trip.title}</h4>
      <p>{trip.destination}</p>
    </div>
  );
};
