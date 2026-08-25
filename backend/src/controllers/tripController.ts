import { Request, Response } from 'express';

const TRIPS = [
  { id: '1', title: 'Alpine Escape & Spa Retreat', destination: 'Swiss Alps', budget: 4500, spent: 2100 }
];

export const getTrips = (req: Request, res: Response) => {
  res.json({ success: true, data: TRIPS });
};

export const createTrip = (req: Request, res: Response) => {
  const trip = { id: Date.now().toString(), ...req.body };
  TRIPS.push(trip);
  res.status(201).json({ success: true, data: trip });
};
