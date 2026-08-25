'use client';

import React from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
            ⚡ PlanYatri Cost Telemetry Engine
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Expenditure &amp; Velocity Analytics
          </h1>
        </div>

        <Link
          href="/dashboard"
          className="px-6 py-2.5 border border-gray-300 font-bold text-sm rounded-full hover:bg-gray-50 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Expenditure Allocation Breakdown */}
        <div className="bg-white p-8 rounded-2xl border border-[#EFEAE2] shadow-sm space-y-6">
          <h3 className="text-xl font-serif font-bold text-[#18181B] border-b border-[#EFEAE2] pb-4">
            Expenditure Breakdown (%)
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>TRANSPORTATION &amp; TRANSFERS</span>
                <span className="text-[#4D41DF]">35%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4D41DF] rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>ACCOMMODATION &amp; GLAMPING</span>
                <span className="text-[#4D41DF]">45%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4D41DF] rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>DINING &amp; EXPERIENCES</span>
                <span className="text-[#914800]">20%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#914800] rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Savings & Delta Cards */}
        <div className="space-y-6">
          <div className="p-8 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
              💰 POTENTIAL SAVINGS METRIC
            </span>
            <h2 className="text-4xl font-extrabold text-[#18181B]">₹35,500 Saved</h2>
            <p className="text-sm text-gray-500">
              By selecting the AI Explorer Balanced Tier instead of unoptimized agency packages.
            </p>
          </div>

          <div className="p-8 bg-[#18181B] text-white rounded-2xl shadow-md space-y-4">
            <span className="text-xs font-mono font-bold text-[#D4A843] uppercase">
              💎 LUXURY DELTA RECOMMENDATION
            </span>
            <h2 className="text-3xl font-serif font-bold">+ ₹77,000 Sovereign Delta</h2>
            <p className="text-sm text-gray-300">
              Upgrade to private 4x4 Fortuner &amp; personal butler luxury glamping.
            </p>
            <Link
              href="/wizard/comparison"
              className="inline-block px-6 py-2.5 bg-[#D4A843] text-[#18181B] font-bold text-sm rounded-full hover:bg-yellow-400 transition-all"
            >
              Compare Tiers Again →
            </Link>
          </div>
        </div>
      </div>

      <VelocityPulse size="sm" label="ANALYTICS ENGINE COMPUTED" />
    </div>
  );
}
