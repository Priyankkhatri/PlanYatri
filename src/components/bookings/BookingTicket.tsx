import React from 'react';
import { Booking } from '@/types';
import '@/styles/Bookings.css';

export const BookingTicket: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="booking-ticket">
      <div>
        <h3>{booking.title}</h3>
        <p style={{ color: '#8C867A', fontSize: 13 }}>Ref: {booking.bookingRef}</p>
      </div>
      <div>
        <span style={{ fontWeight: 800, fontSize: 18 }}>${booking.price}</span>
      </div>
    </div>
  );
};
