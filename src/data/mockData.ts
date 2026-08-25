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
    travelers: 2,
    days: [
      {
        dayNumber: 1,
        date: '2026-09-10',
        activities: [
          { id: 'a1', time: '10:00 AM', title: 'Arrival at Zurich Airport', location: 'Zurich' },
          { id: 'a2', time: '02:00 PM', title: 'Check-in at Hotel Villa Honegg', location: 'Ennetbürgen' }
        ]
      }
    ]
  },
  {
    id: 'trip-2',
    title: 'Tokyo Cyberpunk & Culinary Tour',
    destination: 'Tokyo, Japan',
    startDate: '2026-11-05',
    endDate: '2026-11-15',
    status: 'upcoming',
    budget: 3800,
    spent: 950,
    image: DESTINATION_IMAGES.tokyo,
    travelers: 1
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    type: 'flight',
    title: 'Swiss International Air LX 18',
    provider: 'Swiss Air',
    bookingRef: 'LX-889021',
    date: '2026-09-10',
    price: 1250,
    currency: 'USD',
    status: 'confirmed',
    details: { seat: '12A', class: 'Business' }
  },
  {
    id: 'bk-102',
    type: 'hotel',
    title: 'Hotel Villa Honegg Boutique',
    provider: 'Luxury Escapes',
    bookingRef: 'HVH-7741',
    date: '2026-09-10',
    price: 2400,
    currency: 'USD',
    status: 'confirmed',
    details: { roomType: 'Lake View Suite' }
  }
];

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'dest-1',
    name: 'Kyoto Sanctuary',
    country: 'Japan',
    rating: 4.95,
    reviewsCount: 1280,
    image: DESTINATION_IMAGES.tokyo,
    description: 'Serene bamboo groves, golden temples, and traditional tea ceremonies.',
    tags: ['Culture', 'Luxury', 'Nature'],
    priceLevel: 'luxury',
    popularFor: 'Cherry Blossoms & Temples'
  },
  {
    id: 'dest-2',
    name: 'Amalfi Coast Skyline',
    country: 'Italy',
    rating: 4.91,
    reviewsCount: 940,
    image: DESTINATION_IMAGES.paris,
    description: 'Dramatic cliffside villages, azure waters, and Mediterranean gastronomy.',
    tags: ['Coastal', 'Romantic', 'Dining'],
    priceLevel: 'luxury',
    popularFor: 'Yacht Excursions & Dining'
  }
];

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'ec-1', name: 'Global Tourist Helpline', relation: 'Official Emergency Response', phone: '+1-800-555-0199', isPrimary: true },
  { id: 'ec-2', name: 'Embassy Consular Assistance', relation: 'Diplomatic Service', phone: '+1-800-555-0112' }
];
