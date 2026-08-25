'use client';

import React from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

const BOOKINGS = [
  { id: 'bk-101', type: 'FLIGHT', title: 'Swiss Air LX 18', ref: 'LX-889021', date: '10 Sep 2026', price: '$1,250', status: 'CONFIRMED', seat: '12A (Business Class)' },
  { id: 'bk-102', type: 'STAY', title: 'Grand Hotel Zermatt Spa', ref: 'ZH-44109', date: '11-16 Sep 2026', price: '$1,800', status: 'CONFIRMED', seat: 'Matterhorn Suite' },
  { id: 'bk-103', type: 'TRANSFER', title: 'Private 4x4 Fortuner SUV', ref: 'LEH-7790', date: '20 Sep 2026', price: '₹42,000', status: 'CONFIRMED', seat: 'Dedicated Chauffeur' }
];

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
            🎟️ Reservation Vouchers &amp; Telemetry
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Confirmed Booking Tickets
          </h1>
        </div>

        <Link
          href="/dashboard"
          className="px-6 py-2.5 border border-gray-300 font-bold text-sm rounded-full hover:bg-gray-50 transition-all"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Booking Vouchers List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {BOOKINGS.map((bk) => (
          <div key={bk.id} className="bg-white rounded-2xl border border-[#EFEAE2] shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Left Color Strip */}
            <div className="bg-[#18181B] text-white p-6 md:w-56 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#D4A843] uppercase tracking-widest">{bk.type}</span>
                <h4 className="text-lg font-bold mt-1">{bk.title}</h4>
              </div>
              <div className="font-mono text-xs opacity-75">
                REF: {bk.ref}
              </div>
            </div>

            {/* Main Ticket Body */}
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-gray-400 font-mono">DATES &amp; DETAILS</span>
                  <p className="font-bold text-gray-900">{bk.date}</p>
                  <p className="text-xs text-gray-500">{bk.seat}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {bk.status}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#EFEAE2]">
                <div className="text-lg font-bold text-[#4D41DF]">{bk.price}</div>
                <button
                  onClick={() => alert(`Downloading PDF Voucher for ${bk.ref}`)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 font-bold text-xs rounded-lg hover:bg-gray-200 transition-all"
                >
                  Download PDF Voucher 📄
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <VelocityPulse size="sm" label="VOUCHERS VERIFIED" />
    </div>
  );
}
