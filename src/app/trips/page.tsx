'use client';

import React, { useState } from 'react';
import { MOCK_TRIPS } from '@/data/mockData';
import { TripCard } from '@/components/trips/TripCard';
import { TripFilter } from '@/components/trips/TripFilter';
import '@/styles/Trips.css';

export default function TripsPage() {
  const [filter, setFilter] = useState('all');

  const filteredTrips = MOCK_TRIPS.filter((t) => filter === 'all' || t.status === filter);

  return (
    <div className="trips-container">
      <div className="trips-header">
        <h2>Your Expeditions</h2>
        <TripFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="trips-grid">
        {filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
