import { Request, Response } from 'express';

export const dispatchSOS = (req: Request, res: Response) => {
  const { location } = req.body;
  res.json({ success: true, message: 'SOS Telemetry Dispatched', location });
};
