'use client';

import React from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
            ⚡ PlanYatri Telemetry Center
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Traveler Workspace &amp; Telemetry
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/wizard/destination"
            className="px-6 py-2.5 bg-[#18181B] text-white font-bold text-sm rounded-full hover:bg-[#27272A] transition-all shadow-sm"
          >
            + New Travel Wizard
          </Link>
          <Link
            href="/dashboard/analytics"
            className="px-6 py-2.5 border border-[#4D41DF] text-[#4D41DF] font-bold text-sm rounded-full hover:bg-[#4D41DF]/10 transition-all"
          >
            Cost Analytics
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Expeditions</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-4xl font-extrabold text-[#18181B]">02</h3>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-gray-400">Leh Ladakh &amp; Swiss Alps</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Bookmarks</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-4xl font-extrabold text-[#18181B]">14</h3>
            <span className="text-xs text-[#4D41DF] font-bold bg-[#4D41DF]/10 px-2.5 py-1 rounded-full">
              Curated
            </span>
          </div>
          <p className="text-xs text-gray-400">Destinations &amp; Luxury Stays</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Budget Spent</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-4xl font-extrabold text-[#18181B]">$3,050</h3>
            <span className="text-xs text-[#914800] font-bold bg-[#914800]/10 px-2.5 py-1 rounded-full">
              Explorer Tier
            </span>
          </div>
          <p className="text-xs text-gray-400">Out of $5,000 allocated</p>
        </div>
      </div>

      {/* Active Trip Expeditions Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#18181B]">Active Expeditions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#914800] uppercase">High Altitude • Explorer</span>
                <h3 className="text-xl font-bold text-[#18181B]">Leh Ladakh Expedition</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Upcoming (7 Days)
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 border-t border-[#EFEAE2] pt-4">
              <div className="flex justify-between">
                <span>Transport Mode:</span>
                <strong className="text-gray-900">Private Innova SUV</strong>
              </div>
              <div className="flex justify-between">
                <span>Stay Style:</span>
                <strong className="text-gray-900">Boutique &amp; Glamping</strong>
              </div>
            </div>

            <Link
              href="/itinerary/leh-ladakh"
              className="block w-full py-2.5 text-center bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 text-sm transition-all"
            >
              View Itinerary &amp; Map →
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#4D41DF] uppercase">Alpine Spa • Sovereign</span>
                <h3 className="text-xl font-bold text-[#18181B]">Swiss Alps Retreat</h3>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                Confirmed (5 Days)
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 border-t border-[#EFEAE2] pt-4">
              <div className="flex justify-between">
                <span>Transport Mode:</span>
                <strong className="text-gray-900">Glacier Express First Class</strong>
              </div>
              <div className="flex justify-between">
                <span>Stay Style:</span>
                <strong className="text-gray-900">5-Star Alpine Spa Resort</strong>
              </div>
            </div>

            <Link
              href="/bookings"
              className="block w-full py-2.5 text-center bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 text-sm transition-all"
            >
              View Booking Vouchers →
            </Link>
          </div>
        </div>
      </div>

      <VelocityPulse size="sm" label="WORKSPACE SYNCHRONIZED" />
    </div>
  );
}
