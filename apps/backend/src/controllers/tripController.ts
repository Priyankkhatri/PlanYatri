import { Request, Response } from 'express';

const MOCK_TRIPS = [
  { id: '1', title: 'Alpine Escape & Spa Retreat', destination: 'Swiss Alps', budget: 4500, spent: 2100 }
];

export const getTrips = (req: Request, res: Response) => {
  res.json({ success: true, data: MOCK_TRIPS });
};

export const createTrip = (req: Request, res: Response) => {
  const newTrip = { id: Date.now().toString(), ...req.body };
  MOCK_TRIPS.push(newTrip);
  res.status(201).json({ success: true, data: newTrip });
};
