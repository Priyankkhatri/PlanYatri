import { Request, Response } from 'express';

export const getBookings = (req: Request, res: Response) => {
  res.json({ success: true, data: [{ id: 'bk-1', type: 'flight', title: 'Swiss Air LX 18', price: 1250 }] });
};
