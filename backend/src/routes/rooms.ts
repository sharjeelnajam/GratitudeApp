/**
 * Rooms HTTP API
 * GET /rooms - List available rooms with participant count
 */

import { Router, Response } from 'express';
import { Room } from '../schemas';
import { AuthenticatedRequest } from '../middleware/auth';

export const roomsRouter = Router();

roomsRouter.get('/', async (_req: AuthenticatedRequest, res: Response) => {
  console.log('[Rooms] GET /rooms - hit');
  try {
    const rooms = await Room.find({ isActive: true })
      .select('name environmentType maxParticipants activeParticipants')
      .lean();

    const list = rooms.map((r: { _id: unknown; name: string; environmentType: string; maxParticipants: number; activeParticipants: string[] }) => ({
      id: r._id.toString(),
      name: r.name,
      environmentType: r.environmentType,
      maxParticipants: r.maxParticipants,
      participantCount: r.activeParticipants.length,
      canJoin: r.activeParticipants.length < r.maxParticipants,
    }));

    console.log('[Rooms] GET /rooms - success', { count: list.length });
    res.json({ rooms: list });
  } catch (err) {
    console.error('[Rooms] list error:', err);
    res.status(500).json({ error: 'Failed to list rooms' });
  }
});
