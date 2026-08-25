import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import tripRoutes from './routes/tripRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import geminiRoutes from './routes/geminiRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PlanYatri Express Backend', version: '1.0.0' });
});

app.use('/api/trips', tripRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/gemini', geminiRoutes);

app.listen(ENV.PORT, () => {
  console.log(`[PlanYatri API] Server listening at http://localhost:${ENV.PORT}`);
});
