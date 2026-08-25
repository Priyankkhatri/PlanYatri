import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = jwt.sign({ email, name: 'Alex Rivera' }, ENV.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { name: 'Alex Rivera', email } });
};
