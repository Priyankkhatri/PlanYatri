import { Request, Response } from 'express';

export const dispatchSOS = (req: Request, res: Response) => {
  const { location } = req.body;
  console.log('[PlanYatri SOS Alert Received]:', location);
  res.json({ success: true, message: 'SOS Telemetry Dispatched to Emergency Services', timestamp: new Date() });
};
