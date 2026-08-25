'use client';
import React, { useState } from 'react';
import useRouter from 'next/navigation';
import Link from 'next/link';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const DESTINATIONS = [
  { id: 'leh-ladakh', name: 'Leh Ladakh', country: 'India', tag: 'High Altitude Expedition', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80' },
  { id: 'swiss-alps', name: 'Swiss Alps', country: 'Switzerland', tag: 'Alpine Spa & Ski', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
  { id: 'kyoto', name: 'Kyoto Sanctuary', country: 'Japan', tag: 'Heritage & Temples', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  { id: 'amalfi', name: 'Amalfi Coast', country: 'Italy', tag: 'Coastal Yachting', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' }
];

export default function DestinationStep() {
  const [selected, setSelected] = useState('leh-ladakh');

  return (
    <div className="min-h-screen p-8 bg-[#FAF8F5] flex flex-col items-center">
      <WizardProgress currentStep={1} title="Destination Selection" />
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-3xl font-serif font-bold text-[#18181B] text-center">Where would you like to travel?</h1>
        <p className="text-center text-gray-500">Select a curated destination to initialize AI itinerary optimization.</p>
        
        <div className="grid grid-cols-2 gap-6 pt-4">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setSelected(dest.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white flex gap-4 ${
                selected === dest.id ? 'border-[#4D41DF] shadow-md' : 'border-[#EFEAE2] hover:border-gray-300'
              }`}
            >
              <img src={dest.img} alt={dest.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex flex-col justify-center">
                <span className="text-xs text-[#914800] font-bold uppercase">{dest.tag}</span>
                <h3 className="text-xl font-bold text-[#18181B]">{dest.name}</h3>
                <p className="text-sm text-gray-500">{dest.country}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6">
          <Link href="/wizard/dates" className="px-8 py-3.5 bg-[#18181B] text-white rounded-full font-bold hover:bg-[#27272A] transition-all">
            Continue to Dates →
          </Link>
        </div>
      </div>
    </div>
  );
}
