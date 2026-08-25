import { Router } from 'express';
import authRoutes from './authRoutes';
import tripRoutes from './tripRoutes';
import bookingRoutes from './bookingRoutes';
import emergencyRoutes from './emergencyRoutes';
import destinationRoutes from './destinationRoutes';
import geminiRoutes from './geminiRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/destinations', destinationRoutes);
router.use('/gemini', geminiRoutes);

export default router;
