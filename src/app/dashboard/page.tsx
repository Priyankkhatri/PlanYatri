'use client';

import React from 'react';
import { StatCards } from '@/components/dashboard/StatCards';
import { ExplorationMap } from '@/components/dashboard/ExplorationMap';
import { MOCK_TRIPS } from '@/data/mockData';
import { TripListCard } from '@/components/dashboard/TripListCard';
import '@/styles/Dashboard.css';

export default function DashboardPage() {
  return (
    <div className="db-scroll-body">
      <div className="db-hero-section">
        <div>
          <h1 className="db-hero-h1">Explore More, Live More</h1>
          <p style={{ color: '#8C867A', marginTop: 8 }}>Handcrafted itineraries & real-time travel telemetry.</p>
        </div>
      </div>
      <StatCards />
      <ExplorationMap />
      <div>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Upcoming Journeys</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {MOCK_TRIPS.map((trip) => (
            <TripListCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
