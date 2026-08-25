export type BookingType = 'flight' | 'hotel' | 'cab' | 'experience';

export interface Booking {
  id: string;
  type: BookingType;
  title: string;
  provider: string;
  bookingRef: string;
  date: string;
  price: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  details: Record<string, any>;
}
