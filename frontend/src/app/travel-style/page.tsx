'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

const STYLES = [
  { id: 'nomad', title: 'The High-Altitude Nomad', tag: 'Adventure & Treks', desc: 'Off-grid mountain passes, homestays, and high altitude safaris.' },
  { id: 'explorer', title: 'The Balanced Explorer', tag: 'Culture & Comfort', desc: 'Private SUV transfers, 3-star boutique hotels, and regional dining.' },
  { id: 'sovereign', title: 'The Sovereign Connoisseur', tag: 'Ultra-Luxury', desc: 'Personal butler, luxury glamping suites, and private 4x4 off-roading.' }
];

export default function TravelStylePage() {
  const [selected, setSelected] = useState('explorer');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8 flex flex-col items-center">
      <div className="max-w-3xl w-full text-center space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#18181B] text-[#D4A843] text-xs font-bold uppercase tracking-widest">
          Persona Selection • PlanYatri
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#18181B]">Select Your Travel Persona</h1>
        <p className="text-gray-600">Tailors AI recommendations and transport presets to your style.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {STYLES.map((st) => (
          <div
            key={st.id}
            onClick={() => setSelected(st.id)}
            className={`p-6 bg-white rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selected === st.id ? 'border-[#4D41DF] shadow-lg ring-2 ring-[#4D41DF]/20' : 'border-[#EFEAE2] hover:border-gray-300'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold text-[#914800] uppercase">{st.tag}</span>
              <h3 className="text-xl font-bold text-[#18181B] mt-1">{st.title}</h3>
              <p className="text-xs text-gray-500 mt-2">{st.desc}</p>
            </div>
            <span className={`text-xs font-bold text-center py-2 rounded-full ${
              selected === st.id ? 'bg-[#4D41DF] text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {selected === st.id ? 'Active Persona ✓' : 'Select'}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/wizard/destination"
        className="px-8 py-3.5 bg-[#18181B] text-white font-bold rounded-full hover:bg-[#27272A] transition-all shadow-md"
      >
        Proceed to Travel Wizard →
      </Link>

      <VelocityPulse size="sm" label="PERSONA TELEMETRY SAVED" />
    </div>
  );
}
