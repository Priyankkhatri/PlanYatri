import { Trip, Booking, Destination, EmergencyContact } from '@/types';
import { DESTINATION_IMAGES } from './images';

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    title: 'Alpine Escape & Spa Retreat',
    destination: 'Swiss Alps, Switzerland',
    startDate: '2026-09-10',
    endDate: '2026-09-18',
    status: 'upcoming',
    budget: 4500,
    spent: 2100,
    image: DESTINATION_IMAGES.swiss,
    travelers: 2
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    type: 'flight',
    title: 'Swiss Air LX 18',
    provider: 'Swiss Air',
    bookingRef: 'LX-889021',
    date: '2026-09-10',
    price: 1250,
    currency: 'USD',
    status: 'confirmed',
    details: { seat: '12A' }
  }
];

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'ec-1', name: 'Global Tourist Helpline', relation: 'Emergency Service', phone: '+1-800-555-0199', isPrimary: true }
];
