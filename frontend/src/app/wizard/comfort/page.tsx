'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const TIERS = [
  { id: 'nomad', title: 'The Nomad', budget: '₹35,000 / person', tag: 'Authentic & Budget' },
  { id: 'explorer', title: 'The Explorer', budget: '₹78,000 / person', tag: 'Balanced Luxury (Popular)' },
  { id: 'sovereign', title: 'The Sovereign', budget: '₹1,55,000 / person', tag: 'Ultra-Luxury & Butler' }
];

export default function ComfortStep() {
  const [selected, setSelected] = useState('explorer');

  return (
    <div className="min-h-screen p-8 bg-[#FAF8F5] flex flex-col items-center">
      <WizardProgress currentStep={4} title="Comfort & Tier Preview" />
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-3xl font-serif font-bold text-[#18181B] text-center">Select your comfort baseline</h1>
        
        <div className="grid grid-cols-3 gap-6 pt-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelected(tier.id)}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between space-y-4 ${
                selected === tier.id ? 'border-[#4D41DF] ring-2 ring-[#4D41DF]/20 shadow-lg' : 'border-[#EFEAE2] hover:border-gray-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase text-[#914800]">{tier.tag}</span>
                <h3 className="text-2xl font-bold text-[#18181B] mt-1">{tier.title}</h3>
              </div>
              <div className="text-2xl font-extrabold text-[#4D41DF]">{tier.budget}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/wizard/travelers" className="px-6 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50">
            ← Back
          </Link>
          <Link href="/wizard/stays" className="px-8 py-3.5 bg-[#18181B] text-white rounded-full font-bold hover:bg-[#27272A]">
            Continue to Stays →
          </Link>
        </div>
      </div>
    </div>
  );
}
