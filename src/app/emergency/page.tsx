'use client';

import React from 'react';
import { SOSButton } from '@/components/emergency/SOSButton';
import { MOCK_EMERGENCY_CONTACTS } from '@/data/mockData';
import { EmergencyContactCard } from '@/components/emergency/EmergencyContactCard';
export default function EmergencyPage() {
  const handleSOS = () => {
    alert('SOS Alert Sent to Primary Contacts and Local Response Services!');
  };

  return (
    <div className="emergency-container">
      <h2>Emergency SOS & Concierge Help</h2>
      <div className="sos-banner">
        <p style={{ marginBottom: 20, color: '#991B1B', fontWeight: 600 }}>Press and hold SOS to dispatch location telemetry to emergency responders.</p>
        <SOSButton onTrigger={handleSOS} />
      </div>
      <h3>Trusted Helplines</h3>
      <div className="contacts-grid">
        {MOCK_EMERGENCY_CONTACTS.map((c) => (
          <EmergencyContactCard key={c.id} contact={c} />
        ))}
      </div>
    </div>
  );
}
