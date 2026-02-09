/**
 * Seed default rooms: Fireplace, Forest, Ocean, NightSky
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { Room } from '../schemas';

const ROOMS = [
  { name: 'Fireplace' as const, environmentType: 'fire' as const },
  { name: 'Forest' as const, environmentType: 'forest' as const },
  { name: 'Ocean' as const, environmentType: 'water' as const },
  { name: 'NightSky' as const, environmentType: 'stars' as const },
];

async function seed() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/guided-alignment-rooms';
  await mongoose.connect(uri);
  console.log('[Seed] Connected to MongoDB');

  for (const r of ROOMS) {
    const exists = await Room.findOne({ name: r.name });
    if (exists) {
      console.log(`[Seed] Room "${r.name}" already exists`);
      continue;
    }
    await Room.create({
      name: r.name,
      environmentType: r.environmentType,
      maxParticipants: 7,
      activeParticipants: [],
      isActive: true,
    });
    console.log(`[Seed] Created room "${r.name}"`);
  }

  await mongoose.disconnect();
  console.log('[Seed] Done');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
