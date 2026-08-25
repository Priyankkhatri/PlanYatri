'use client';
import React from 'react';
import { StatCards } from '@/components/dashboard/StatCards';

export default function DashboardPage() {
  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-serif font-bold">PlanYatri Telemetry Dashboard</h1>
      <StatCards />
    </div>
  );
}
