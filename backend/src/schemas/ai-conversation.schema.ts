/**
 * AI Conversation Schema
 * Stores per-user conversation history for the AI companion.
 * Only the last N messages are kept to minimize token usage.
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface IAIConversation extends Document {
  firebaseUid: string;
  messages: IMessage[];
  userSummary: string;
  lastActiveAt: Date;
}

const MAX_STORED_MESSAGES = 20;

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AIConversationSchema = new Schema<IAIConversation>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    messages: { type: [MessageSchema], default: [] },
    userSummary: { type: String, default: '' },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { collection: 'ai_conversations' }
);

AIConversationSchema.pre('save', function () {
  if (this.messages.length > MAX_STORED_MESSAGES) {
    this.messages = this.messages.slice(-MAX_STORED_MESSAGES);
  }
});

export const AIConversation = mongoose.model<IAIConversation>(
  'AIConversation',
  AIConversationSchema
);
