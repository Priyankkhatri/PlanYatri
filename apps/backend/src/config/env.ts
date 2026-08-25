import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'planyatri-super-secret-jwt-key',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
