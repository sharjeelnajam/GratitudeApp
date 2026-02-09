/**
 * useLiveRoom Hook
 * Connects to backend Socket.IO, joins room, listens for events, handles leave on unmount.
 * Minimal example: join, listen, leave.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  connectSocket,
  joinRoom,
  leaveRoom,
  disconnectSocket,
  type SessionState,
  type RoomJoinedPayload,
} from '@/services/room';

export type LiveRoomState = {
  isConnected: boolean;
  isJoined: boolean;
  roomId: string | null;
  roomName: string | null;
  participantCount: number;
  sessionState: SessionState | null;
  currentSpeakerId: string | null;
  error: string | null;
};

export function useLiveRoom(roomId: string | null) {
  const [state, setState] = useState<LiveRoomState>({
    isConnected: false,
    isJoined: false,
    roomId: null,
    roomName: null,
    participantCount: 0,
    sessionState: null,
    currentSpeakerId: null,
    error: null,
  });

  const clearError = useCallback(() => setState((s) => ({ ...s, error: null })), []);

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;

    const connect = async () => {
      try {
        await connectSocket({
          onRoomJoined: (data: RoomJoinedPayload) => {
            if (!mounted) return;
            setState((s) => ({
              ...s,
              isJoined: true,
              roomId: data.roomId,
              roomName: data.roomName,
              participantCount: data.participantCount,
              sessionState: data.state,
              error: null,
            }));
          },
          onParticipantCount: (data) => {
            if (!mounted) return;
            setState((s) => ({ ...s, participantCount: data.count }));
          },
          onSessionState: (data) => {
            if (!mounted) return;
            setState((s) => ({
              ...s,
              sessionState: data.state as SessionState,
              currentSpeakerId: data.currentSpeakerId ?? null,
            }));
          },
          onError: (data) => {
            if (!mounted) return;
            setState((s) => ({ ...s, error: data.message }));
          },
        });
        if (!mounted) return;
        setState((s) => ({ ...s, isConnected: true, error: null }));
        joinRoom(roomId);
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to connect';
        setState((s) => ({ ...s, error: msg }));
      }
    };

    connect();
    return () => {
      mounted = false;
      leaveRoom();
      disconnectSocket();
      setState({
        isConnected: false,
        isJoined: false,
        roomId: null,
        roomName: null,
        participantCount: 0,
        sessionState: null,
        currentSpeakerId: null,
        error: null,
      });
    };
  }, [roomId]);

  return { ...state, clearError };
}
