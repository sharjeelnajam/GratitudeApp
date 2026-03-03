/**
 * User Schema
 * Stores verified Firebase users. Sync from Firebase on first login.
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  photoURL: string;
  createdAt: Date;
  lastLogin: Date;
  isSubscriber?: boolean;
  subscriptionPlan?: string;
  subscriptionCurrency?: string;
  subscriptionAmountCents?: number;
  subscriptionLastPaidAt?: Date | null;
  subscriptionStatus?: 'active' | 'expired' | 'canceled';
  subscriptionExpiresAt?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    isSubscriber: { type: Boolean, default: false },
    subscriptionPlan: { type: String, default: '' },
    subscriptionCurrency: { type: String, default: 'EUR' },
    subscriptionAmountCents: { type: Number, default: 0 },
    subscriptionLastPaidAt: { type: Date, default: null },
    subscriptionStatus: { type: String, default: 'expired' },
    subscriptionExpiresAt: { type: Date, default: null },
  },
  { collection: 'users' }
);

// firebaseUid unique index is created by { unique: true } in schema above

export const User = mongoose.model<IUser>('User', UserSchema);
