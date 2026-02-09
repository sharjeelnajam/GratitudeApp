/**
 * Express application
 * HTTP API for auth sync, rooms list, etc.
 */

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { roomsRouter } from './routes/rooms';
import { authMiddleware } from './middleware/auth';

const app = express();

const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
  'http://localhost:8081',
  'http://localhost:19006',
];

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

// Request logging - logs when API is hit
app.use((req, _res, next) => {
  console.log(`[API] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check (no auth)
app.get('/health', (_req, res) => {
  console.log('[API] Health check OK');
  res.json({ ok: true, service: 'guided-alignment-room' });
});

// Auth routes (sync-user requires Bearer token)
app.use('/auth', authRouter);

// Room HTTP API (protected)
app.use('/rooms', authMiddleware, roomsRouter);

export { app };
