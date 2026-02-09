/**
 * Auth Service
 * Firebase Auth + backend sync. Do NOT store passwords locally.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  User as FirebaseUser,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { API_URL } from '@/config/api';

// Debug: log API URL on first use (check in Metro terminal)
if (__DEV__) {
  console.log('[Auth] API_URL:', API_URL);
}

export type AuthUser = {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  photoURL: string;
  lastLogin: string;
};

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(true);
}

export async function syncUserToBackend(token: string): Promise<AuthUser> {
  const url = `${API_URL}/auth/sync-user`;
  console.log('[Auth] Syncing to backend:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[Auth] sync-user response:', res.status, res.statusText);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.log('[Auth] sync-user error body:', err);
      throw new Error(err.error ?? 'Failed to sync user');
    }
    const data = await res.json();
    return data.user;
  } catch (e) {
    console.log('[Auth] sync-user fetch failed:', e instanceof Error ? e.message : e);
    throw e;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const token = await cred.user.getIdToken();
  return syncUserToBackend(token);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string
): Promise<AuthUser> {
  console.log('[Auth] signUpWithEmail: creating Firebase user...');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  console.log('[Auth] Firebase user created, uid:', cred.user.uid);
  if (name?.trim() && typeof updateProfile === 'function') {
    try {
      await updateProfile(cred.user, { displayName: name.trim() });
    } catch {
      // Non-blocking: profile update may fail in some environments
    }
  }
  const token = await cred.user.getIdToken(true);
  console.log('[Auth] Got ID token, syncing to backend...');
  return syncUserToBackend(token);
}

export async function signInWithGoogle(idToken: string, accessToken?: string): Promise<AuthUser> {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const cred = await signInWithCredential(auth, credential);
  const token = await cred.user.getIdToken();
  return syncUserToBackend(token);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}
