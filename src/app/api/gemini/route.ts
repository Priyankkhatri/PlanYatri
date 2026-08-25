import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { destination, days } = await req.json();
  
  return NextResponse.json({
    success: true,
    data: {
      itinerary: `Handcrafted ${days}-day luxury itinerary for ${destination}`,
      recommendedPlaces: ['Grand Hotel', 'Michelin Restaurant', 'Historical Temple'],
      estimatedCost: days * 450
    }
  });
}
