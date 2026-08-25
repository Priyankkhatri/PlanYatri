'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import VelocityPulse from '@/components/VelocityPulse';

const ITINERARY_DAYS = [
  {
    day: 1,
    title: 'Arrival in Leh & Acclimatization',
    elevation: '11,500 ft',
    temp: '14°C',
    activities: [
      { time: '09:00 AM', title: 'Airport Pick-up via Private Innova', desc: 'Transfer to boutique hotel & welcome butter tea', cost: 'Included' },
      { time: '02:00 PM', title: 'Gentle Stroll in Leh Market', desc: 'Acclimatization walk & local handicraft exploration', cost: 'Free' },
      { time: '07:30 PM', title: 'Welcome Ladakhi Dinner', desc: 'Traditional dinner at hotel dining hall', cost: '₹1,200' }
    ]
  },
  {
    day: 2,
    title: 'Sham Valley & Magnetic Hill Circuit',
    elevation: '11,000 ft',
    temp: '16°C',
    activities: [
      { time: '09:30 AM', title: 'Hall of Fame & Spituk Monastery', desc: 'Guided cultural tour of ancient Buddhist stupas', cost: '₹300' },
      { time: '01:00 PM', title: 'Magnetic Hill & Sangam Confluence', desc: 'Witness Indus & Zanskar river confluence', cost: 'Included' }
    ]
  },
  {
    day: 3,
    title: 'Nubra Valley via Khardung La Pass',
    elevation: '17,582 ft',
    temp: '4°C',
    activities: [
      { time: '08:00 AM', title: 'Cross World’s Highest Motorable Pass', desc: 'Khardung La Pass photography & tea break', cost: 'Permit Included' },
      { time: '04:00 PM', title: 'Diskit Monastery & Hunder Sand Dunes', desc: 'Bactrian double-hump camel safari', cost: '₹800' }
    ]
  },
  {
    day: 4,
    title: 'Pangong Tso Lake Glamping',
    elevation: '13,940 ft',
    temp: '8°C',
    activities: [
      { time: '10:00 AM', title: 'Drive to Turquoise Pangong Lake', desc: 'Check-in to luxury lakeside glamping tents', cost: 'Included' },
      { time: '08:00 PM', title: 'Stargazing & Campfire Session', desc: 'Clear high-altitude night sky observation', cost: 'Complimentary' }
    ]
  }
];

export default function DestinationItineraryPage() {
  const params = useParams();
  const destName = (params?.destination as string) || 'leh-ladakh';
  const formattedTitle = destName.replace('-', ' ').toUpperCase();

  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B]">
      {/* Hero Banner */}
      <div className="bg-[#18181B] text-white p-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#4D41DF] text-white text-xs font-extrabold uppercase rounded-full">
              Verified Itinerary
            </span>
            <span className="text-[#D4A843] text-xs font-mono font-bold">
              ⚡ PLANYATRI TELEMETRY ACTIVE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold">
            {formattedTitle} EXPEDITION
          </h1>

          {/* Telemetry Chips */}
          <div className="flex flex-wrap gap-6 pt-4 text-xs font-mono">
            <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-gray-400">ELEVATION:</span> <strong className="text-[#D4A843]">11,500 FT</strong>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-gray-400">OXYGEN TELEMETRY:</span> <strong className="text-emerald-400">88% NORMAL</strong>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-gray-400">AVG TEMP:</span> <strong className="text-white">12°C</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Day Selector & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#EFEAE2]">
            {ITINERARY_DAYS.map((d: any) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeDay === d.day
                    ? 'bg-[#18181B] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#EFEAE2]'
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          {/* Active Day Details */}
          {ITINERARY_DAYS.filter((d: any) => d.day === activeDay).map((dayData) => (
            <div key={dayData.day} className="bg-white p-8 rounded-2xl border border-[#EFEAE2] shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-[#EFEAE2] pb-4">
                <div>
                  <span className="text-xs text-[#4D41DF] font-extrabold uppercase">Day {dayData.day} Itinerary</span>
                  <h2 className="text-2xl font-serif font-bold text-[#18181B]">{dayData.title}</h2>
                </div>
                <div className="text-right text-xs font-mono text-gray-500">
                  <p>Elev: {dayData.elevation}</p>
                  <p>Temp: {dayData.temp}</p>
                </div>
              </div>

              {/* Activity Cards */}
              <div className="space-y-4">
                {dayData.activities.map((act, idx) => (
                  <div key={idx} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFEAE2] flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-[#4D41DF]">{act.time}</span>
                      <h4 className="font-bold text-[#18181B]">{act.title}</h4>
                      <p className="text-xs text-gray-500">{act.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-white border border-[#EFEAE2] rounded-full text-xs font-bold text-[#18181B]">
                      {act.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reservation Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold border-b border-[#EFEAE2] pb-3">Trip Reservation</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Selected Tier:</span>
                <strong className="text-[#4D41DF]">The Explorer</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <strong>7 Days / 6 Nights</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transport:</span>
                <strong>Private Innova SUV</strong>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#EFEAE2] text-lg">
                <span>Total Budget:</span>
                <strong className="text-[#4D41DF]">₹78,000</strong>
              </div>
            </div>

            <Link
              href="/bookings"
              className="block w-full text-center py-3.5 bg-[#18181B] text-white font-bold rounded-xl hover:bg-[#27272A] transition-all shadow-md"
            >
              Confirm Reservation →
            </Link>
          </div>

          <div className="p-6 bg-[#18181B] text-white rounded-2xl text-center space-y-4">
            <VelocityPulse size="sm" label="LIVE EMERGENCIES MONITORED" />
            <p className="text-xs text-gray-400">
              High-altitude SOS dispatch enabled for this itinerary.
            </p>
            <Link href="/emergency" className="inline-block text-xs text-[#EF4444] font-bold underline">
              View Emergency Protocol
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
