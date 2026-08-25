import { Router } from 'express';
import { generateItineraryFromAI } from '../services/geminiService';

const router = Router();
router.post('/generate', async (req, res) => {
  const { destination, days } = req.body;
  const result = await generateItineraryFromAI(destination || 'Paris', days || 5);
  res.json({ success: true, data: result });
});

export default router;
