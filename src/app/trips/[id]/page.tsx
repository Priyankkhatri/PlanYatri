'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MOCK_TRIPS } from '@/data/mockData';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
export default function TripDetailPage() {
  const params = useParams();
  const trip = MOCK_TRIPS.find((t) => t.id === params?.id) || MOCK_TRIPS[0];

  return (
    <div className="trips-container">
      <h2>{trip.title}</h2>
      <p style={{ color: '#8C867A' }}>{trip.destination} • {trip.startDate} - {trip.endDate}</p>
      <InteractiveMap />
    </div>
  );
}
