'use client';

import React, { useState } from 'react';
import { MOCK_DESTINATIONS } from '@/data/mockData';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { DestinationSearch } from '@/components/destinations/DestinationSearch';
export default function DestinationsPage() {
  const [search, setSearch] = useState('');

  const list = MOCK_DESTINATIONS.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="destinations-container">
      <h2>Curated Destinations</h2>
      <DestinationSearch value={search} onChange={setSearch} />
      <div className="dest-grid">
        {list.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
}
