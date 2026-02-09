/**
 * MongoDB connection
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/guided-alignment-rooms';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log('[DB] Connected to MongoDB');
}

export { seedRoomsIfEmpty } from './seedRooms';
