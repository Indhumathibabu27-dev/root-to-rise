import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateRoute } from './routes/calculate.js';
import { historyRouter } from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/calculate', calculateRoute);
app.use('/api/history', historyRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`StoreOrSell backend running on http://localhost:${PORT}`);
});
