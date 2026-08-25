'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { WizardProgress } from '@/components/wizard/WizardProgress';

export default function DatesStep() {
  const [duration, setDuration] = useState(7);

  return (
    <div className="min-h-screen p-8 bg-[#FAF8F5] flex flex-col items-center">
      <WizardProgress currentStep={2} title="Travel Dates & Duration" />
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl border border-[#EFEAE2]">
        <h1 className="text-3xl font-serif font-bold text-[#18181B] text-center">How long is your expedition?</h1>
        
        <div className="space-y-4 text-center">
          <span className="text-5xl font-extrabold text-[#4D41DF]">{duration} Days</span>
          <input
            type="range"
            min={3}
            max={21}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-[#4D41DF]"
          />
          <div className="flex justify-between text-xs text-gray-400 font-semibold">
            <span>3 Days (Weekend Break)</span>
            <span>7 Days (Recommended)</span>
            <span>21 Days (Grand Tour)</span>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-[#EFEAE2]">
          <Link href="/wizard/destination" className="px-6 py-3 border border-gray-300 rounded-full font-bold hover:bg-gray-50">
            ← Back
          </Link>
          <Link href="/wizard/travelers" className="px-8 py-3.5 bg-[#18181B] text-white rounded-full font-bold hover:bg-[#27272A]">
            Continue to Travelers →
          </Link>
        </div>
      </div>
    </div>
  );
}
