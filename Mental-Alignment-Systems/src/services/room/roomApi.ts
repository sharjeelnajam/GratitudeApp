/**
 * Room HTTP API
 * Fetch rooms list from backend.
 */

import { API_URL } from '@/config/api';
import { getIdToken } from '@/services/auth';

export type RoomListItem = {
  id: string;
  name: string;
  environmentType: string;
  maxParticipants: number;
  participantCount: number;
  canJoin: boolean;
};

export async function fetchRooms(): Promise<RoomListItem[]> {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch rooms');
  const data = await res.json();
  return data.rooms ?? [];
}

const ROOM_NAME_MAP: Record<string, string> = {
  fireplace: 'Fireplace',
  ocean: 'Ocean',
  forest: 'Forest',
  nightSky: 'NightSky',
};

/** Resolve room ID from room type (fireplace, ocean, etc.) by matching name. */
export async function getRoomIdByType(roomType: string): Promise<string | null> {
  const roomName = ROOM_NAME_MAP[roomType] ?? roomType;
  const rooms = await fetchRooms();
  const match = rooms.find((r) => r.name.toLowerCase() === roomName.toLowerCase());
  return match?.id ?? null;
}
