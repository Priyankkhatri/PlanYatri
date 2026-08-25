'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
export const Topbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="topbar-container">
      <input className="topbar-search" type="text" placeholder="Search destinations, trips..." />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{user ? user.name : 'Guest User'}</span>
      </div>
    </div>
  );
};
