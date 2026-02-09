/**
 * Auto-seed rooms if collection is empty.
 * Called on server startup.
 */

import { Room } from '../schemas';

const ROOMS = [
  { name: 'Fireplace' as const, environmentType: 'fire' as const },
  { name: 'Forest' as const, environmentType: 'forest' as const },
  { name: 'Ocean' as const, environmentType: 'water' as const },
  { name: 'NightSky' as const, environmentType: 'stars' as const },
];

export async function seedRoomsIfEmpty(): Promise<void> {
  const count = await Room.countDocuments();
  if (count > 0) {
    console.log('[DB] Rooms already exist, skipping seed');
    return;
  }
  for (const r of ROOMS) {
    await Room.create({
      name: r.name,
      environmentType: r.environmentType,
      maxParticipants: 7,
      activeParticipants: [],
      isActive: true,
    });
    console.log('[DB] Created room:', r.name);
  }
  console.log('[DB] Seeded', ROOMS.length, 'rooms');
}
