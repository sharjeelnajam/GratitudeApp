/**
 * HTTP Auth Middleware
 * Extracts Bearer token, verifies via Firebase Admin, attaches user to req.
 */

import { Request, Response, NextFunction } from 'express';
import { getAuth, DecodedToken } from '../firebase/admin';

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('[Auth] Rejected: missing or invalid Authorization header');
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(token);
    console.log('[Auth] Token verified for:', decoded.uid);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
    next();
  } catch (err) {
    console.log('[Auth] Token verification failed:', err instanceof Error ? err.message : 'unknown');
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
