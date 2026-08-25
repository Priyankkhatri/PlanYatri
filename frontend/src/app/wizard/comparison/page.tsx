'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

export default function WizardComparisonPage() {
  const [selectedTier, setSelectedTier] = useState('explorer');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-4 py-1.5 rounded-full bg-[#18181B] text-[#D4A843] text-xs font-bold uppercase tracking-widest">
            AI Synthesis Complete • PlanYatri Telemetry
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#18181B]">
            Comparative Expedition Tiers
          </h1>
          <p className="text-gray-600 font-sans">
            AI-calculated expenditure profiles for <strong className="text-[#18181B]">Leh Ladakh (7 Days)</strong> based on your preferences.
          </p>
        </div>

        {/* 3-Tier Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          {/* Tier 1: Budget Nomad */}
          <div
            onClick={() => setSelectedTier('nomad')}
            className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              selectedTier === 'nomad' ? 'border-[#4D41DF] shadow-xl ring-2 ring-[#4D41DF]/20' : 'border-[#EFEAE2] hover:border-gray-300'
            }`}
          >
            <div>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                The Nomad
              </span>
              <h3 className="text-2xl font-bold text-[#18181B] mb-2">Budget Tier</h3>
              <div className="text-4xl font-extrabold text-[#18181B] mb-1">₹35,000</div>
              <p className="text-xs text-gray-500 mb-6">Estimated total per person</p>

              <div className="space-y-4 text-sm text-gray-600 border-t border-[#EFEAE2] pt-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#4D41DF] font-bold">🚌</span>
                  <div>
                    <p className="font-semibold text-gray-900">Shared Taxi</p>
                    <p className="text-xs text-gray-500">Scheduled group transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#4D41DF] font-bold">🏡</span>
                  <div>
                    <p className="font-semibold text-gray-900">Authentic Homestays</p>
                    <p className="text-xs text-gray-500">Traditional Ladakhi hospitality</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/itinerary/leh-ladakh"
              className="mt-8 w-full py-3 text-center bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              Select Nomad Tier
            </Link>
          </div>

          {/* Tier 2: Explorer (Balanced - Featured) */}
          <div
            onClick={() => setSelectedTier('explorer')}
            className={`bg-white rounded-2xl p-8 border-2 relative overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              selectedTier === 'explorer' ? 'border-[#4D41DF] shadow-2xl ring-4 ring-[#4D41DF]/20 scale-105' : 'border-[#4D41DF] shadow-lg'
            }`}
          >
            <div className="absolute top-0 right-0 bg-[#4D41DF] text-white text-[10px] font-extrabold px-4 py-1 uppercase tracking-widest rounded-bl-xl">
              Most Popular
            </div>

            <div>
              <span className="bg-[#4D41DF]/10 text-[#4D41DF] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                The Explorer
              </span>
              <h3 className="text-2xl font-bold text-[#18181B] mb-2">Balanced Tier</h3>
              <div className="text-4xl font-extrabold text-[#4D41DF] mb-1">₹78,000</div>
              <p className="text-xs text-gray-500 mb-6">Estimated total per person</p>

              <div className="space-y-4 text-sm text-gray-600 border-t border-[#EFEAE2] pt-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#4D41DF] font-bold">🚘</span>
                  <div>
                    <p className="font-semibold text-gray-900">Private Xylo / Innova SUV</p>
                    <p className="text-xs text-gray-500">Comfortable mid-size SUV</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#4D41DF] font-bold">🏨</span>
                  <div>
                    <p className="font-semibold text-gray-900">3-Star Boutique Hotels</p>
                    <p className="text-xs text-gray-500">Central Leh &amp; lakeside tents</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/itinerary/leh-ladakh"
              className="mt-8 w-full py-3.5 text-center bg-[#4D41DF] text-white font-bold rounded-full hover:bg-[#3622CA] transition-all shadow-md"
            >
              Select Explorer Tier →
            </Link>
          </div>

          {/* Tier 3: Sovereign (Luxury) */}
          <div
            onClick={() => setSelectedTier('sovereign')}
            className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              selectedTier === 'sovereign' ? 'border-[#914800] shadow-xl ring-2 ring-[#914800]/20' : 'border-[#EFEAE2] hover:border-gray-300'
            }`}
          >
            <div>
              <span className="bg-[#914800]/10 text-[#914800] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                The Sovereign
              </span>
              <h3 className="text-2xl font-bold text-[#18181B] mb-2">Premium Tier</h3>
              <div className="text-4xl font-extrabold text-[#914800] mb-1">₹1,55,000</div>
              <p className="text-xs text-gray-500 mb-6">Estimated total per person</p>

              <div className="space-y-4 text-sm text-gray-600 border-t border-[#EFEAE2] pt-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#914800] font-bold">🏎️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Private 4x4 Off-roader</p>
                    <p className="text-xs text-gray-500">Luxury Toyota Fortuner</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#914800] font-bold">⛺</span>
                  <div>
                    <p className="font-semibold text-gray-900">Luxury Heritage Camps</p>
                    <p className="text-xs text-gray-500">Exclusive glamping with personal butler</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/itinerary/leh-ladakh"
              className="mt-8 w-full py-3 text-center border-2 border-[#914800] text-[#914800] font-bold rounded-full hover:bg-[#914800] hover:text-white transition-all"
            >
              Select Sovereign Tier
            </Link>
          </div>
        </div>

        {/* Cost Analytics & Allocation Section */}
        <section className="bg-white rounded-2xl p-8 border border-[#EFEAE2] shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-[#EFEAE2] pb-4">
            <h2 className="text-2xl font-serif font-bold text-[#18181B]">PlanYatri Cost Analytics</h2>
            <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
              ⚡ Live Telemetry Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Allocation Progress Bars */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Budget Allocation (%)</h4>
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>TRANSPORTATION</span>
                  <span className="text-[#4D41DF]">35%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4D41DF] rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>ACCOMMODATION &amp; STAYS</span>
                  <span className="text-[#4D41DF]">45%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4D41DF] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            {/* Metric Highlight Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-[#4D41DF]/5 rounded-xl border border-[#4D41DF]/20 flex flex-col justify-center space-y-1">
                <span className="text-xs font-bold text-[#4D41DF] uppercase tracking-wider">Potential Saving</span>
                <p className="text-3xl font-extrabold text-[#18181B]">₹35,500</p>
                <span className="text-[11px] text-gray-500">Vs default travel packages</span>
              </div>
              
              <div className="p-6 bg-[#914800]/5 rounded-xl border border-[#914800]/20 flex flex-col justify-center space-y-1">
                <span className="text-xs font-bold text-[#914800] uppercase tracking-wider">Luxury Delta</span>
                <p className="text-3xl font-extrabold text-[#18181B]">+ ₹77,000</p>
                <span className="text-[11px] text-gray-500">For butler &amp; private 4x4</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <VelocityPulse size="sm" label="TELEMETRY SYNCHRONIZED" />
    </div>
  );
}
