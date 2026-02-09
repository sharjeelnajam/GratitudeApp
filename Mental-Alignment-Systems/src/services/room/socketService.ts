/**
 * Socket.IO Room Service
 * Connect to backend, join/leave rooms, listen for real-time events.
 */

import { io, Socket } from 'socket.io-client';
import { API_URL } from '@/config/api';
import { getIdToken } from '@/services/auth';

const SOCKET_URL = API_URL;

let socket: Socket | null = null;

export type SessionState =
  | 'ARRIVAL'
  | 'BREATHING'
  | 'INTENTION'
  | 'CARD_SELECTION'
  | 'OPTIONAL_SHARING'
  | 'CLOSING';

export type RoomJoinedPayload = {
  roomId: string;
  roomName: string;
  participantCount: number;
  state: SessionState;
};

export type ChatMessagePayload = {
  id: string;
  participantId: string;
  participantName: string;
  content: string;
  createdAt: string;
};

export type RoomEventHandlers = {
  onRoomJoined?: (data: RoomJoinedPayload) => void;
  onParticipantCount?: (data: { roomId: string; count: number }) => void;
  onParticipantJoined?: (data: { firebaseUid: string; displayName: string }) => void;
  onParticipantLeft?: (data: { firebaseUid: string; displayName: string }) => void;
  onSessionState?: (data: {
    roomId: string;
    state: SessionState;
    currentSpeakerId?: string | null;
    speakerTurnEndsAt?: string | null;
  }) => void;
  onAlignmentShared?: (data: {
    shareId: string;
    displayName: string;
    cardId: string;
    hasReflection: boolean;
    createdAt: string;
  }) => void;
  onChatMessage?: (data: ChatMessagePayload) => void;
  onError?: (data: { code: string; message: string }) => void;
};

export async function connectSocket(handlers: RoomEventHandlers = {}): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('room:joined', (data: RoomJoinedPayload) => handlers.onRoomJoined?.(data));
  socket.on('room:participant_count', (data) => handlers.onParticipantCount?.(data));
  socket.on('room:participant_joined', (data) => handlers.onParticipantJoined?.(data));
  socket.on('room:participant_left', (data) => handlers.onParticipantLeft?.(data));
  socket.on('session:state', (data) => handlers.onSessionState?.(data));
  socket.on('alignment:shared', (data) => handlers.onAlignmentShared?.(data));
  socket.on('room:chat_message', (data) => handlers.onChatMessage?.(data));
  socket.on('error', (data) => handlers.onError?.(data));

  return new Promise((resolve, reject) => {
    socket!.on('connect', () => resolve(socket!));
    socket!.on('connect_error', (err) => reject(err));
  });
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinRoom(roomId: string): void {
  socket?.emit('room:join', { roomId });
}

export function leaveRoom(): void {
  socket?.emit('room:leave');
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function transitionSession(roomId: string, nextState: SessionState): void {
  socket?.emit('session:transition', { roomId, nextState });
}

export function submitAlignmentShare(
  roomId: string,
  cardId: string,
  reflectionText?: string
): void {
  socket?.emit('alignment:share', { roomId, cardId, reflectionText });
}

export function sendChatMessage(roomId: string, content: string): void {
  const trimmed = content.trim();
  if (!trimmed) return;
  socket?.emit('room:chat', { roomId, content: trimmed });
}
