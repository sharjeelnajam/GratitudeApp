/**
 * Room Session Schema
 * Active session state for a room. Backend controls state transitions.
 * Session states: ARRIVAL -> BREATHING -> INTENTION -> CARD_SELECTION -> OPTIONAL_SHARING -> CLOSING
 */

import mongoose, { Document, Schema } from 'mongoose';

export type SessionState =
  | 'ARRIVAL'
  | 'BREATHING'
  | 'INTENTION'
  | 'CARD_SELECTION'
  | 'OPTIONAL_SHARING'
  | 'CLOSING';

export interface IRoomSession extends Document {
  roomId: mongoose.Types.ObjectId;
  roomName: string;
  state: SessionState;
  currentSpeakerId: string | null; // firebaseUid of current speaker (OPTIONAL_SHARING only)
  speakerTurnEndsAt: Date | null; // time-box for sharing
  participants: Array<{
    firebaseUid: string;
    userId: mongoose.Types.ObjectId;
    displayName: string;
    joinedAt: Date;
  }>;
  startedAt: Date;
  updatedAt: Date;
}

const RoomSessionSchema = new Schema<IRoomSession>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    roomName: { type: String, required: true },
    state: { type: String, default: 'ARRIVAL' },
    currentSpeakerId: { type: String, default: null },
    speakerTurnEndsAt: { type: Date, default: null },
    participants: [
      {
        firebaseUid: String,
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        displayName: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    startedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'room_sessions' }
);

RoomSessionSchema.index({ roomId: 1 });
RoomSessionSchema.index({ 'participants.firebaseUid': 1 });

export const RoomSession = mongoose.model<IRoomSession>(
  'RoomSession',
  RoomSessionSchema
);
