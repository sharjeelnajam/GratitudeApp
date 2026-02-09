/**
 * Guided Alignment Room™ Backend
 *
 * Express + Socket.IO + MongoDB.
 * Firebase Auth for verification. Max 7 users per room.
 * Backend is the single source of truth.
 */

import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app';
import { initSocketServer } from './socket';
import { connectDatabase, seedRoomsIfEmpty } from './db';
import { initFirebaseAdmin } from './firebase/admin';

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
  initFirebaseAdmin();
  await connectDatabase();
  await seedRoomsIfEmpty();
  const httpServer = createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`[Guided Alignment Room] Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('[Fatal]', err);
  process.exit(1);
});
