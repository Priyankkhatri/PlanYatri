import { NextResponse } from 'next/server';
import { MOCK_TRIPS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_TRIPS });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, data: body });
}
