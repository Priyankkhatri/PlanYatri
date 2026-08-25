'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

const TRIPS_DATA = [
  { id: 'leh-ladakh', title: 'Leh Ladakh High-Altitude Expedition', status: 'Upcoming', dates: '10 Sep - 18 Sep 2026', tier: 'Explorer Tier', cost: '₹78,000', travelers: 2, img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80' },
  { id: 'swiss-alps', title: 'Swiss Alps Spa & Ski Retreat', status: 'Confirmed', dates: '01 Oct - 08 Oct 2026', tier: 'Sovereign Tier', cost: '$4,500', travelers: 2, img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
  { id: 'kyoto', title: 'Kyoto Heritage & Zen Sanctuary', status: 'Completed', dates: '12 Apr - 20 Apr 2026', tier: 'Nomad Tier', cost: '₹45,000', travelers: 1, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' }
];

export default function TripsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = TRIPS_DATA.filter((t) => {
    if (filter === 'upcoming') return t.status === 'Upcoming' || t.status === 'Confirmed';
    if (filter === 'completed') return t.status === 'Completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
            ✈️ Expeditions Portfolio
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Your Travel Expeditions
          </h1>
        </div>

        <div className="flex gap-2 bg-[#FAF8F5] p-1.5 rounded-full border border-[#EFEAE2]">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filter === 'all' ? 'bg-[#18181B] text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            All Trips
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filter === 'upcoming' ? 'bg-[#18181B] text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filter === 'completed' ? 'bg-[#18181B] text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl border border-[#EFEAE2] overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-48">
                <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-[#18181B]/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  {trip.status}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[11px] font-mono font-bold text-[#4D41DF] uppercase">{trip.tier}</span>
                <h3 className="text-xl font-bold text-[#18181B]">{trip.title}</h3>
                <p className="text-xs text-gray-500">{trip.dates} • {trip.travelers} Travelers</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-[#EFEAE2] mt-4 flex justify-between items-center">
              <span className="text-lg font-extrabold text-[#18181B]">{trip.cost}</span>
              <Link
                href={`/itinerary/${trip.id}`}
                className="px-4 py-2 bg-[#18181B] text-white text-xs font-bold rounded-full hover:bg-[#27272A] transition-all"
              >
                View Itinerary →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <VelocityPulse size="sm" label="EXPEDITIONS SYNCHRONIZED" />
    </div>
  );
}
