/**
 * Firebase Admin SDK
 * Verifies ID tokens from the client.
 */

import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let initialized = false;

function getServiceAccount(): admin.ServiceAccount | string | undefined {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (base64) {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(json) as admin.ServiceAccount;
    } catch {
      console.error('[Firebase] Invalid FIREBASE_SERVICE_ACCOUNT_BASE64');
      return undefined;
    }
  }

  const pathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const filePath = pathEnv ?? path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as admin.ServiceAccount;
  }

  console.warn(
    '[Firebase] No service account found. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_BASE64.'
  );
  return undefined;
}

export function initFirebaseAdmin(): void {
  if (initialized) return;

  const credential = getServiceAccount();
  if (credential) {
    admin.initializeApp({ credential: admin.credential.cert(credential) });
    initialized = true;
    console.log('[Firebase] Admin SDK initialized');
  }
}

export function getAuth(): admin.auth.Auth {
  initFirebaseAdmin();
  return admin.auth();
}

export interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

export async function verifyIdToken(token: string): Promise<DecodedToken> {
  const decoded = await getAuth().verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture,
  };
}
