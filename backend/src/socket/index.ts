/**
 * Socket.IO Server
 * Firebase auth middleware. Room join/leave. Session state machine.
 * Reject unauthenticated connections.
 */

import { Server } from 'socket.io';
import { getAuth } from '../firebase/admin';
import { Room, RoomSession, User, AlignmentShare } from '../schemas';
import mongoose from 'mongoose';
import type { SessionState } from '../schemas';

const SHARING_TURN_SECONDS = 75; // Time-box for optional sharing
const VALID_STATE_TRANSITIONS: Record<SessionState, SessionState[]> = {
  ARRIVAL: ['BREATHING'],
  BREATHING: ['INTENTION'],
  INTENTION: ['CARD_SELECTION'],
  CARD_SELECTION: ['OPTIONAL_SHARING'],
  OPTIONAL_SHARING: ['CLOSING'],
  CLOSING: [],
};

export interface SocketUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  mongoUserId?: string;
}

export interface AuthenticatedSocket {
  user: SocketUser;
}

export function initSocketServer(httpServer: import('http').Server): void {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
        'http://localhost:8081',
        'http://localhost:19006',
      ],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token ?? socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = await getAuth().verifyIdToken(token);
      (socket as AuthenticatedSocket).user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', async (socket) => {
    const { user } = socket as AuthenticatedSocket;

    socket.on('room:join', async (payload: { roomId: string }) => {
      const { roomId } = payload ?? {};
      if (!roomId) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'roomId required' });
        return;
      }

      try {
        const room = await Room.findById(roomId);
        if (!room || !room.isActive) {
          socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found or inactive' });
          return;
        }

        if (room.activeParticipants.length >= room.maxParticipants) {
          socket.emit('error', {
            code: 'ROOM_FULL',
            message: 'Room is full. Maximum 7 participants.',
          });
          return;
        }

        if (room.activeParticipants.includes(user.uid)) {
          socket.join(`room:${roomId}`);
          const session = await getOrCreateSession(roomId, room.name);
          socket.emit('room:joined', {
            roomId,
            roomName: room.name,
            participantCount: room.activeParticipants.length,
            state: session.state,
          });
          io.to(`room:${roomId}`).emit('room:participant_count', {
            roomId,
            count: room.activeParticipants.length,
          });
          return;
        }

        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) {
          socket.emit('error', { code: 'USER_NOT_SYNCED', message: 'Sync user first via /auth/sync-user' });
          return;
        }

        room.activeParticipants.push(user.uid);
        await room.save();

        const session = await getOrCreateSession(roomId, room.name);
        session.participants.push({
          firebaseUid: user.uid,
          userId: dbUser._id,
          displayName: user.name ?? user.email ?? 'Guest',
          joinedAt: new Date(),
        });
        session.updatedAt = new Date();
        await session.save();

        (socket as AuthenticatedSocket).user!.mongoUserId = dbUser._id.toString();
        socket.join(`room:${roomId}`);
        socket.data.roomId = roomId;

        socket.emit('room:joined', {
          roomId,
          roomName: room.name,
          participantCount: room.activeParticipants.length,
          state: session.state,
        });
        io.to(`room:${roomId}`).emit('room:participant_count', {
          roomId,
          count: room.activeParticipants.length,
        });
        io.to(`room:${roomId}`).emit('room:participant_joined', {
          firebaseUid: user.uid,
          displayName: user.name ?? user.email ?? 'Guest',
        });
      } catch (err) {
        console.error('[Socket] room:join error:', err);
        socket.emit('error', { code: 'JOIN_FAILED', message: 'Failed to join room' });
      }
    });

    socket.on('room:leave', async () => {
      await handleLeave(socket, io);
    });

    socket.on('room:chat', async (payload: { roomId: string; content: string }) => {
      const { roomId, content } = payload ?? {};
      const trimmed = typeof content === 'string' ? content.trim() : '';
      if (!roomId || !trimmed) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'roomId and content required' });
        return;
      }

      const currentRoomId = socket.data.roomId as string | undefined;
      if (currentRoomId !== roomId) {
        socket.emit('error', { code: 'NOT_IN_ROOM', message: 'You must be in the room to send messages' });
        return;
      }

      const displayName = user.name ?? user.email ?? 'Guest';
      const msg = {
        id: new mongoose.Types.ObjectId().toString(),
        participantId: user.uid,
        participantName: displayName,
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      io.to(`room:${roomId}`).emit('room:chat_message', msg);
    });

    socket.on(
      'alignment:share',
      async (payload: { roomId: string; cardId: string; reflectionText?: string }) => {
        const { roomId, cardId, reflectionText } = payload ?? {};
        if (!roomId || !cardId) {
          socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'roomId and cardId required' });
          return;
        }

        try {
          const session = await RoomSession.findOne({ roomId }).sort({ updatedAt: -1 });
          if (!session || session.state !== 'OPTIONAL_SHARING') {
            socket.emit('error', {
              code: 'NOT_SHARING_STATE',
              message: 'Sharing only allowed during OPTIONAL_SHARING',
            });
            return;
          }
          if (session.currentSpeakerId !== user.uid) {
            socket.emit('error', {
              code: 'NOT_YOUR_TURN',
              message: 'One person speaks at a time',
            });
            return;
          }
          const dbUser = await User.findOne({ firebaseUid: user.uid });
          if (!dbUser) {
            socket.emit('error', { code: 'USER_NOT_SYNCED', message: 'Sync user first' });
            return;
          }

          const share = await AlignmentShare.create({
            roomId: new mongoose.Types.ObjectId(roomId),
            userId: dbUser._id,
            cardId,
            reflectionText: reflectionText ?? undefined,
          });

          io.to(`room:${roomId}`).emit('alignment:shared', {
            shareId: share._id.toString(),
            userId: dbUser._id.toString(),
            displayName: user.name ?? user.email ?? 'Guest',
            cardId,
            hasReflection: !!reflectionText,
            createdAt: share.createdAt.toISOString(),
          });
        } catch (err) {
          console.error('[Socket] alignment:share error:', err);
          socket.emit('error', { code: 'SHARE_FAILED', message: 'Failed to submit share' });
        }
      }
    );

    socket.on('session:transition', async (payload: { roomId: string; nextState: SessionState }) => {
      const { roomId, nextState } = payload ?? {};
      if (!roomId || !nextState) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'roomId and nextState required' });
        return;
      }

      try {
        const session = await RoomSession.findOne({ roomId }).sort({ updatedAt: -1 });
        if (!session) {
          socket.emit('error', { code: 'SESSION_NOT_FOUND', message: 'No active session' });
          return;
        }

        const allowed = VALID_STATE_TRANSITIONS[session.state as SessionState];
        if (!allowed?.includes(nextState)) {
          socket.emit('error', {
            code: 'INVALID_TRANSITION',
            message: `Cannot transition from ${session.state} to ${nextState}`,
          });
          return;
        }

        session.state = nextState;
        session.currentSpeakerId = null;
        session.speakerTurnEndsAt = null;
        if (nextState === 'OPTIONAL_SHARING') {
          const first = session.participants[0];
          if (first) {
            session.currentSpeakerId = first.firebaseUid;
            const end = new Date();
            end.setSeconds(end.getSeconds() + SHARING_TURN_SECONDS);
            session.speakerTurnEndsAt = end;
          }
        }
        session.updatedAt = new Date();
        await session.save();

        io.to(`room:${roomId}`).emit('session:state', {
          roomId,
          state: session.state,
          currentSpeakerId: session.currentSpeakerId,
          speakerTurnEndsAt: session.speakerTurnEndsAt?.toISOString(),
        });
      } catch (err) {
        console.error('[Socket] session:transition error:', err);
        socket.emit('error', { code: 'TRANSITION_FAILED', message: 'Failed to transition state' });
      }
    });

    socket.on('disconnect', async () => {
      await handleLeave(socket, io);
    });
  });
}

async function getOrCreateSession(
  roomId: string,
  roomName: string
): Promise<InstanceType<typeof RoomSession>> {
  let session = await RoomSession.findOne({ roomId }).sort({ updatedAt: -1 });
  if (!session) {
    session = await RoomSession.create({
      roomId: new mongoose.Types.ObjectId(roomId),
      roomName,
      state: 'ARRIVAL',
      participants: [],
      startedAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return session;
}

async function handleLeave(
  socket: import('socket.io').Socket,
  io: Server
): Promise<void> {
  const roomId = socket.data.roomId as string | undefined;
  if (!roomId) return;

  const { user } = socket as AuthenticatedSocket;
  if (!user) return;

  try {
    const room = await Room.findById(roomId);
    if (room) {
        room.activeParticipants = room.activeParticipants.filter((uid: string) => uid !== user.uid);
      await room.save();

      await RoomSession.updateOne(
        { roomId },
        { $pull: { participants: { firebaseUid: user.uid } }, $set: { updatedAt: new Date() } }
      );

      socket.leave(`room:${roomId}`);
      socket.data.roomId = undefined;

      io.to(`room:${roomId}`).emit('room:participant_left', {
        firebaseUid: user.uid,
        displayName: user.name ?? user.email ?? 'Guest',
      });
      io.to(`room:${roomId}`).emit('room:participant_count', {
        roomId,
        count: room.activeParticipants.length,
      });
    }
  } catch (err) {
    console.error('[Socket] room:leave error:', err);
  }
}
