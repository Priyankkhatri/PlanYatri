'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const TRAVELER_TYPES = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Single traveler seeking freedom & reflection', icon: 'person' },
  { id: 'couple', label: 'Romantic Duo', desc: 'Two travelers exploring together', icon: 'favorite' },
  { id: 'family', label: 'Family Trip', desc: 'Parents and children travel suite', icon: 'family_restroom' },
  { id: 'tribe', label: 'Friends Tribe', desc: 'Group of 4+ adventure seekers', icon: 'groups' }
];

export default function TravelersStep() {
  const [selected, setSelected] = useState('couple');

  return (
    <div className="min-h-screen p-8 bg-[#FAF8F5] flex flex-col items-center">
      <WizardProgress currentStep={3} title="Companion Profile" />
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl font-serif font-bold text-[#18181B] text-center">Who are you traveling with?</h1>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {TRAVELER_TYPES.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white space-y-2 ${
                selected === t.id ? 'border-[#4D41DF] shadow-md' : 'border-[#EFEAE2] hover:border-gray-300'
              }`}
            >
              <h3 className="text-xl font-bold text-[#18181B]">{t.label}</h3>
              <p className="text-sm text-gray-500">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/wizard/dates" className="px-6 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50">
            ← Back
          </Link>
          <Link href="/wizard/comfort" className="px-8 py-3.5 bg-[#18181B] text-white rounded-full font-bold hover:bg-[#27272A]">
            Continue to Comfort →
          </Link>
        </div>
      </div>
    </div>
  );
}
