'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VelocityPulse from '@/components/VelocityPulse';

const LOG_MESSAGES = [
  'Initializing PlanYatri Telemetry Engine...',
  'Analyzing high-altitude route topography & weather data...',
  'Fetching real-time transport & Innova/Fortuner tariff matrices...',
  'Checking luxury stay & boutique glamping availability...',
  'Synthesizing Nomad, Explorer & Sovereign comparative tiers...',
  'Finalizing 3-Tier AI Itinerary Matrix...'
];

export default function WizardLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            router.push('/wizard/comparison');
          }, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    const step = Math.min(
      Math.floor((progress / 100) * LOG_MESSAGES.length),
      LOG_MESSAGES.length - 1
    );
    setLogIndex(step);
  }, [progress]);

  return (
    <div className="min-h-screen p-8 bg-[#18181B] text-white flex flex-col items-center justify-center space-y-12">
      <VelocityPulse size="lg" label="COMPUTING 3-TIER ITINERARY MATRIX" />

      <div className="max-w-xl w-full space-y-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#D4A843]">
          Orchestrating Your Expedition
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3 p-0.5 border border-white/20">
          <div
            className="h-full bg-gradient-to-r from-[#4D41DF] to-[#D4A843] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage & Live Log */}
        <div className="flex justify-between text-xs font-mono text-gray-400 border-b border-white/10 pb-2">
          <span>STATUS: PROCESSING</span>
          <span className="text-[#D4A843] font-bold">{progress}%</span>
        </div>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm font-mono text-[#D4A843] animate-pulse">
          &gt; {LOG_MESSAGES[logIndex]}
        </div>
      </div>
    </div>
  );
}
