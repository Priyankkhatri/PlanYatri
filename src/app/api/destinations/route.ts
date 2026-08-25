import { NextResponse } from 'next/server';
import { MOCK_DESTINATIONS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_DESTINATIONS });
}
