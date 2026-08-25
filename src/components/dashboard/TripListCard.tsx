import React from 'react';
import { Trip } from '@/types';
export const TripListCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <div className="trip-card">
      <img className="trip-card-image" src={trip.image} alt={trip.title} />
      <div className="trip-card-body">
        <span className={`trip-badge ${trip.status}`}>{trip.status}</span>
        <h3 style={{ marginTop: 8, fontSize: 18 }}>{trip.title}</h3>
        <p style={{ color: '#8C867A', fontSize: 14 }}>{trip.destination}</p>
      </div>
    </div>
  );
};
