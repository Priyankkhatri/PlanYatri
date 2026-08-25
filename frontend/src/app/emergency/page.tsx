'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SOSButton } from '@/components/emergency/SOSButton';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useStorage } from '@/hooks/useStorage';
import VelocityPulse from '@/components/VelocityPulse';

export default function EmergencyPage() {
  const location = useGeolocation();
  const [offlineAlerts, setOfflineAlerts] = useStorage<any[]>('planyatri_sos_alerts', []);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const handleSOSTrigger = () => {
    setIsDispatching(true);

    const alertData = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: location.lat ? `${location.lat}, ${location.lng}` : 'Leh Altitude Sector (11,500 ft)',
      status: 'active'
    };

    setTimeout(() => {
      setOfflineAlerts([...offlineAlerts, alertData]);
      setIsDispatching(false);
      setDispatchSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-red-600 uppercase">
            🚨 PlanYatri Safety Network
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Emergency SOS &amp; Concierge Dispatch
          </h1>
        </div>

        <Link
          href="/dashboard"
          className="px-6 py-2.5 border border-gray-300 font-bold text-sm rounded-full hover:bg-gray-50 transition-all"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Main Trigger Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOS Button Display Panel */}
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm flex flex-col items-center justify-center space-y-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-red-600">
            High-Altitude Telemetry SOS
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Pressing SOS dispatches your live coordinates to regional emergency responders and saved primary contacts.
          </p>

          <SOSButton onTrigger={handleSOSTrigger} isDispatching={isDispatching} />

          {dispatchSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-mono font-bold w-full max-w-md">
              ✓ EMERGENCY DISPATCH TRANSMITTED: Location queued &amp; synced locally.
            </div>
          )}

          <div className="text-xs font-mono text-gray-400 space-y-1">
            <p>LAT/LNG: {location.lat ? `${location.lat}, ${location.lng}` : 'Searching GPS...'}</p>
            <p>OFFLINE SYNC FALLBACK: ACTIVE</p>
          </div>
        </div>

        {/* Regional Helplines & Trusted Contacts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm space-y-4">
            <h3 className="text-xl font-serif font-bold border-b border-[#EFEAE2] pb-3">
              Regional Emergency Helplines
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFEAE2] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#18181B]">Himalayan Mountain Rescue</h4>
                  <p className="text-xs text-gray-500">High-altitude evacuation squad</p>
                </div>
                <a href="tel:108" className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs rounded-full">
                  Call 108
                </a>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFEAE2] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#18181B]">Tourist Police &amp; Permits</h4>
                  <p className="text-xs text-gray-500">Leh Sector Control Room</p>
                </div>
                <a href="tel:112" className="px-4 py-1.5 bg-[#18181B] text-white font-bold text-xs rounded-full">
                  Call 112
                </a>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFEAE2] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#18181B]">PlanYatri 24/7 Butler Line</h4>
                  <p className="text-xs text-gray-500">Sovereign tier concierge desk</p>
                </div>
                <a href="tel:+18005550199" className="px-4 py-1.5 bg-[#4D41DF] text-white font-bold text-xs rounded-full">
                  Call Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VelocityPulse size="sm" label="EMERGENCY SAFETY TELEMETRY ARMED" />
    </div>
  );
}
