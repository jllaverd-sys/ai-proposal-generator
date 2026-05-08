import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { proposalRouter } from './routes/proposal.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/proposal', proposalRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
