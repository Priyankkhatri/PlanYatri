import { Request, Response } from 'express';

export const generateItinerary = async (req: Request, res: Response) => {
  const { destination, days } = req.body;
  res.json({
    success: true,
    data: {
      destination,
      days,
      itinerary: `Curated luxury ${days}-day itinerary for ${destination}`,
      highlights: ['Michelin Dining', 'Private Helicopter Excursion', '5-Star Spa']
    }
  });
};
