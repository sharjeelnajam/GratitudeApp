/**
 * useAuth Hook
 * Firebase auth state and actions.
 */

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/auth/firebaseConfig';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  syncUserToBackend,
  type AuthUser,
} from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const token = await fbUser.getIdToken();
        const synced = await syncUserToBackend(token);
        setUser(synced);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const u = await signInWithEmail(email, password);
        setUser(u);
        return u;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sign in failed';
        setError(msg);
        throw e;
      }
    },
    []
  );

  const signUpEmail = useCallback(
    async (email: string, password: string, name?: string) => {
      setError(null);
      try {
        const u = await signUpWithEmail(email, password, name);
        setUser(u);
        return u;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sign up failed';
        setError(msg);
        throw e;
      }
    },
    []
  );

  const signInWithGoogleCred = useCallback(
    async (idToken: string, accessToken?: string) => {
      setError(null);
      try {
        const u = await signInWithGoogle(idToken, accessToken);
        setUser(u);
        return u;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Google sign in failed';
        setError(msg);
        throw e;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);
    await authSignOut();
    setUser(null);
  }, []);

  return {
    user,
    firebaseUser,
    loading,
    error,
    isAuthenticated: !!user,
    signInEmail,
    signUpEmail,
    signInWithGoogle: signInWithGoogleCred,
    signOut,
  };
}
