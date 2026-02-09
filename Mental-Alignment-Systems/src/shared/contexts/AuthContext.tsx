/**
 * Auth Context
 * Provides auth state and actions app-wide.
 */

import React, { createContext, useContext } from 'react';
import { useAuth } from '@/shared/hooks';

type AuthContextValue = ReturnType<typeof useAuth>;

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
