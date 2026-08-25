import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-[#EFEAE2] p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-extrabold font-serif">PlanYatri</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="p-2 rounded hover:bg-[#F6F4F0]">Dashboard</Link>
        <Link href="/trips" className="p-2 rounded hover:bg-[#F6F4F0]">Trips</Link>
        <Link href="/bookings" className="p-2 rounded hover:bg-[#F6F4F0]">Bookings</Link>
        <Link href="/emergency" className="p-2 rounded hover:bg-[#F6F4F0] text-red-600 font-bold">Emergency SOS</Link>
      </nav>
    </aside>
  );
}
