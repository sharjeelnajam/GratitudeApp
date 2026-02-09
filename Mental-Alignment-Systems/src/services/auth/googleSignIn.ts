/**
 * Google Sign-In via expo-auth-session
 * Requires: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
 * Add to Firebase Console: Web app with same client ID, or use Firebase's web client ID.
 */

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { signInWithGoogle } from './authService';
import type { AuthUser } from './authService';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export async function promptGoogleSignIn(): Promise<AuthUser> {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      'Google Sign-In not configured. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env'
    );
  }

  // Use preferLocalhost so emulator gets exp://localhost (Google accepts localhost).
  // For physical device + Expo Go: Google rejects exp://192.168.x.x. Use a development build instead.
  const redirectUri = makeRedirectUri({
    scheme: 'myapp',
    path: 'auth/google',
    preferLocalhost: true,
  });

  // IdToken flow does not use PKCE - Google rejects code_challenge_method for this flow
  const request = new AuthSession.AuthRequest({
    clientId,
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
    responseType: AuthSession.ResponseType.IdToken,
    usePKCE: false,
  });

  const result = await request.promptAsync(GOOGLE_DISCOVERY);

  if (result.type !== 'success') {
    throw new Error('Google Sign-In was cancelled or failed');
  }

  const idToken = result.params.id_token;
  if (!idToken) {
    throw new Error('Google Sign-In did not return an ID token');
  }

  return signInWithGoogle(idToken);
}
