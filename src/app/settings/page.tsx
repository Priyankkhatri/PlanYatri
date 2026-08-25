'use client';

import React, { useState } from 'react';
import { SettingsToggle } from '@/components/settings/SettingsToggle';
import '@/styles/Settings.css';

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);

  return (
    <div className="settings-container">
      <h2>App Preferences</h2>
      <div className="settings-section">
        <SettingsToggle label="Email Itinerary Updates" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
      </div>
    </div>
  );
}
