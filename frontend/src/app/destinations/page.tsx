'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

const ALL_DESTINATIONS = [
  { id: 'leh-ladakh', name: 'Leh Ladakh', country: 'India', tag: 'High Altitude', rating: 4.95, price: 'from ₹35,000', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80', desc: 'Turquoise lakes, ancient stupas & Khardung La pass.' },
  { id: 'swiss-alps', name: 'Swiss Alps', country: 'Switzerland', tag: 'Alpine Spa', rating: 4.98, price: 'from $2,800', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', desc: 'Glacier Express, 5-star ski resorts & Matterhorn views.' },
  { id: 'kyoto', name: 'Kyoto Sanctuary', country: 'Japan', tag: 'Heritage', rating: 4.92, price: 'from $1,950', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80', desc: 'Bamboo groves, traditional teahouses & Zen gardens.' },
  { id: 'amalfi', name: 'Amalfi Coast', country: 'Italy', tag: 'Coastal Yachting', rating: 4.96, price: 'from €2,400', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', desc: 'Clifftop villas, private yacht charters & Mediterranean dining.' }
];

export default function DestinationsPage() {
  const [search, setSearch] = useState('');

  const filtered = ALL_DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
            🌍 Global Destinations Catalog
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Curated Expedition Gallery
          </h1>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations, tags..."
          className="p-3 border border-[#EFEAE2] rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#4D41DF]"
        />
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((dest) => (
          <div key={dest.id} className="bg-white rounded-2xl border border-[#EFEAE2] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="relative h-48">
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-[#18181B]/80 backdrop-blur-md text-[#D4A843] text-xs font-bold px-3 py-1 rounded-full">
                  ★ {dest.rating}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#914800]">{dest.tag}</span>
                <h3 className="text-xl font-bold text-[#18181B]">{dest.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{dest.desc}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-[#EFEAE2] mt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-[#4D41DF]">{dest.price}</span>
              <Link
                href="/wizard/destination"
                className="px-4 py-2 bg-[#18181B] text-white text-xs font-bold rounded-full hover:bg-[#27272A] transition-all"
              >
                Plan Trip →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <VelocityPulse size="sm" label="CATALOG SYNCHRONIZED" />
    </div>
  );
}
