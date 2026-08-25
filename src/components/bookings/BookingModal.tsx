'use client';

import React from 'react';

export const BookingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#FFF', padding: 32, borderRadius: 16, width: 400 }}>
        <h3>New Flight / Hotel Reservation</h3>
        <button style={{ marginTop: 20 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
