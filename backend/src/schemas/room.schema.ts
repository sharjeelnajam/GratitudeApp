/**
 * Room Schema
 * Room templates: Fireplace, Forest, Ocean, NightSky.
 * activeParticipants = array of firebaseUid (max 7).
 */

import mongoose, { Document, Schema } from 'mongoose';

export type RoomName = 'Fireplace' | 'Forest' | 'Ocean' | 'NightSky';
export type EnvironmentType = 'fire' | 'forest' | 'water' | 'stars';

export interface IRoom extends Document {
  name: RoomName;
  environmentType: EnvironmentType;
  maxParticipants: number;
  activeParticipants: string[];
  isActive: boolean;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    environmentType: { type: String, required: true },
    maxParticipants: { type: Number, default: 7 },
    activeParticipants: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'rooms' }
);

RoomSchema.index({ name: 1 });

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
