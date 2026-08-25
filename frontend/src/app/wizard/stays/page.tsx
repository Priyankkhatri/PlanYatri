'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const STAYS = [
  { id: 'homestay', title: 'Authentic Homestays', desc: 'Local Ladakhi hospitality & home-cooked meals' },
  { id: 'boutique', title: '3-Star Boutique Hotel', desc: 'Central Leh & lakeside boutique tents' },
  { id: 'glamping', title: 'Heritage Luxury Camps', desc: 'Exclusive glamping suites with personal butler' }
];

export default function StaysStep() {
  const [selected, setSelected] = useState('boutique');

  return (
    <div className="min-h-screen p-8 bg-[#FAF8F5] flex flex-col items-center">
      <WizardProgress currentStep={5} title="Stay Style" />
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl font-serif font-bold text-[#18181B] text-center">Where would you like to stay?</h1>
        
        <div className="space-y-4 pt-4">
          {STAYS.map((stay) => (
            <div
              key={stay.id}
              onClick={() => setSelected(stay.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white flex justify-between items-center ${
                selected === stay.id ? 'border-[#4D41DF] shadow-md' : 'border-[#EFEAE2] hover:border-gray-300'
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-[#18181B]">{stay.title}</h3>
                <p className="text-sm text-gray-500">{stay.desc}</p>
              </div>
              <input type="radio" checked={selected === stay.id} readOnly className="accent-[#4D41DF] w-5 h-5" />
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/wizard/comfort" className="px-6 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50">
            ← Back
          </Link>
          <Link href="/wizard/transport" className="px-8 py-3.5 bg-[#18181B] text-white rounded-full font-bold hover:bg-[#27272A]">
            Continue to Transport →
          </Link>
        </div>
      </div>
    </div>
  );
}
