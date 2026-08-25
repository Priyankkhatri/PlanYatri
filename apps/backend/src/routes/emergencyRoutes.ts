import { Router } from 'express';
import { dispatchSOS } from '../controllers/emergencyController';

const router = Router();
router.post('/sos', dispatchSOS);

export default router;
