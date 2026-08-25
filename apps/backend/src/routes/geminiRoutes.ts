import { Router } from 'express';
import { generateItinerary } from '../controllers/geminiController';

const router = Router();
router.post('/generate', generateItinerary);

export default router;
