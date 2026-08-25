import { NextResponse } from 'next/server';
import { MOCK_BOOKINGS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_BOOKINGS });
}
