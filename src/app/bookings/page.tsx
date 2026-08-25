'use client';

import React from 'react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { BookingTicket } from '@/components/bookings/BookingTicket';
import '@/styles/Bookings.css';

export default function BookingsPage() {
  return (
    <div className="bookings-container">
      <h2>Flight & Stay Reservations</h2>
      <div className="booking-list">
        {MOCK_BOOKINGS.map((bk) => (
          <BookingTicket key={bk.id} booking={bk} />
        ))}
      </div>
    </div>
  );
}
