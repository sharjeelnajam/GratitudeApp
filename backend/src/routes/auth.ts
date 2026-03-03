/**
 * Auth routes
 * POST /auth/sync-user - Syncs Firebase user to MongoDB
 */

import { Router, Response } from 'express';
import { User } from '../schemas';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/sync-user', authMiddleware, async (req: AuthRequest, res: Response) => {
  console.log('[Auth] POST /auth/sync-user - hit');
  if (!req.user) {
    console.log('[Auth] sync-user - rejected: no user');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { uid, email, name, picture } = req.user;
  const now = new Date();

  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: {
          email: email ?? '',
          name: name ?? '',
          photoURL: picture ?? '',
          lastLogin: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { new: true, upsert: true }
    );

    console.log('[Auth] sync-user - success', { uid, email });
    res.json({
      user: {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error('[Auth] sync-user error:', err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});
