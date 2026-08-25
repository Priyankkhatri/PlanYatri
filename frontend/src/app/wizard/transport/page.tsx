'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { WizardProgress } from '@/components/wizard/WizardProgress';

const TRANSPORTS = [
  { id: 'shared', title: 'Shared Taxi / Group Transfer', desc: 'Budget-friendly scheduled transfers' },
  { id: 'suv', title: 'Private Xylo / Innova SUV', desc: 'Comfortable mid-size SUV with local driver' },
  { id: 'offroad', title: 'Private 4x4 Fortuner', desc: 'Luxury high-clearance off-roader' }
];

export default function TransportStep() {
  const [selected, setSelected] = useState('suv');

  return (
    <div className="min-h-screen p-8 bg-[#FAF8F5] flex flex-col items-center">
      <WizardProgress currentStep={6} title="Transport Mode" />
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl font-serif font-bold text-[#18181B] text-center">How would you like to travel?</h1>
        
        <div className="space-y-4 pt-4">
          {TRANSPORTS.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white flex justify-between items-center ${
                selected === t.id ? 'border-[#4D41DF] shadow-md' : 'border-[#EFEAE2] hover:border-gray-300'
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-[#18181B]">{t.title}</h3>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </div>
              <input type="radio" checked={selected === t.id} readOnly className="accent-[#4D41DF] w-5 h-5" />
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/wizard/stays" className="px-6 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50">
            ← Back
          </Link>
          <Link href="/wizard/loading" className="px-8 py-3.5 bg-[#4D41DF] text-white rounded-full font-bold hover:bg-[#3622CA] shadow-lg">
            Generate AI Comparison Matrix ✨
          </Link>
        </div>
      </div>
    </div>
  );
}
