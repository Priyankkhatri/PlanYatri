import { Request, Response } from 'express';

export const getDestinations = (req: Request, res: Response) => {
  res.json({ success: true, data: [{ id: 'd-1', name: 'Kyoto Sanctuary', country: 'Japan', rating: 4.95 }] });
};
