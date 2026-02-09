/**
 * Room background video mapping.
 * Each room type uses one of 3 looping videos; cycle so room 4+ repeats (1→2→3→1…).
 */

export type RoomVideoType = 'fireplace' | 'ocean' | 'forest' | 'nightSky';

const VIDEO_SOURCES = [
  require('../../../assets/live-room-video/live-effect-1.mp4'),
  require('../../../assets/live-room-video/live-effect-2.mp4'),
  require('../../../assets/live-room-video/live-effect-3.mp4'),
] as const;

const ROOM_VIDEO_INDEX: Record<RoomVideoType, number> = {
  fireplace: 0,
  ocean: 1,
  forest: 2,
  nightSky: 0,
};

export function getRoomBackgroundVideoSource(
  roomType: RoomVideoType
): (typeof VIDEO_SOURCES)[number] {
  const index = ROOM_VIDEO_INDEX[roomType] ?? 0;
  return VIDEO_SOURCES[index % VIDEO_SOURCES.length];
}
