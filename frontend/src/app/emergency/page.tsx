'use client';
import React from 'react';
import { SOSButton } from '@/components/emergency/SOSButton';

export default function EmergencyPage() {
  const handleSOS = () => alert('SOS Alert Dispatched to Emergency Responders!');
  return (
    <div className="p-10 max-w-xl mx-auto text-center space-y-8">
      <h1 className="text-3xl font-serif font-bold text-red-600">Emergency SOS Concierge</h1>
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl">
        <SOSButton onTrigger={handleSOS} />
      </div>
    </div>
  );
}
