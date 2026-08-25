import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing Auth Token' });
  }

  try {
    const verified = jwt.verify(token, ENV.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid Token' });
  }
};
