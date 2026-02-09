/**
 * Alignment Share Schema (NOT CHAT)
 * Private reflection artifacts. No replies, threading, or editing.
 * Content is "what I noticed" — never advice.
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IAlignmentShare extends Document {
  roomId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  cardId: string;
  reflectionText?: string;
  reflectionAudioUrl?: string;
  createdAt: Date;
}

const AlignmentShareSchema = new Schema<IAlignmentShare>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cardId: { type: String, required: true },
    reflectionText: { type: String },
    reflectionAudioUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'alignment_shares' }
);

AlignmentShareSchema.index({ roomId: 1, createdAt: -1 });
AlignmentShareSchema.index({ userId: 1 });

export const AlignmentShare = mongoose.model<IAlignmentShare>(
  'AlignmentShare',
  AlignmentShareSchema
);
