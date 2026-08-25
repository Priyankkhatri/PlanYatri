import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PlanYatri Express Backend', version: '1.0.0' });
});

app.use('/api', routes);
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`[PlanYatri Backend] Server listening at http://localhost:${ENV.PORT}`);
});
