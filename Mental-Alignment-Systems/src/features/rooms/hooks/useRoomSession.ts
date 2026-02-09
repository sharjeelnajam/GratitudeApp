/**
 * useRoomSession Hook
 *
 * Connects to backend Socket.IO, joins room by type, handles chat messages.
 * Max 7 participants enforced by backend. Falls back to local-only chat if socket unavailable.
 */

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import {
  connectSocket,
  joinRoom,
  leaveRoom,
  disconnectSocket,
  sendChatMessage as socketSendChat,
  getRoomIdByType,
  type RoomJoinedPayload,
  type ChatMessagePayload,
} from '@/services/room';
import { AuthContext } from '@/shared/contexts';
import type { ChatMessage } from '../components/ChatModal';

export type RoomSessionState = {
  roomId: string | null;
  roomName: string | null;
  participantCount: number;
  chatMessages: ChatMessage[];
  isConnected: boolean;
  isJoined: boolean;
  error: string | null;
};

export function useRoomSession(roomType: string | null) {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const [state, setState] = useState<RoomSessionState>({
    roomId: null,
    roomName: null,
    participantCount: 0,
    chatMessages: [],
    isConnected: false,
    isJoined: false,
    error: null,
  });

  const currentUserId = user?.firebaseUid ?? null;
  const currentUserName = user?.name ?? user?.email ?? 'You';
  const currentUserIdRef = useRef(currentUserId);
  currentUserIdRef.current = currentUserId;

  const sendChatMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const optimisticMsg: ChatMessage = {
        id: `msg-opt-${Date.now()}`,
        participantId: currentUserId ?? 'me',
        participantName: currentUserName,
        content: trimmed,
        isOwn: true,
      };

      if (state.roomId && state.isConnected) {
        setState((s) => ({ ...s, chatMessages: [...s.chatMessages, optimisticMsg] }));
        socketSendChat(state.roomId, trimmed);
      } else {
        setState((s) => ({ ...s, chatMessages: [...s.chatMessages, optimisticMsg] }));
      }
    },
    [state.roomId, state.isConnected, currentUserId, currentUserName]
  );

  useEffect(() => {
    if (!roomType) return;

    let mounted = true;
    let resolvedRoomId: string | null = null;

    const connect = async () => {
      try {
        const roomId = await getRoomIdByType(roomType);
        resolvedRoomId = roomId;

        if (!roomId) {
          if (mounted) {
            setState((s) => ({
              ...s,
              error: 'Room not found. Using offline mode.',
              roomId: null,
              roomName: roomType.charAt(0).toUpperCase() + roomType.slice(1),
            }));
          }
          return;
        }

        await connectSocket({
          onRoomJoined: (data: RoomJoinedPayload) => {
            if (!mounted) return;
            setState((s) => ({
              ...s,
              isJoined: true,
              roomId: data.roomId,
              roomName: data.roomName,
              participantCount: data.participantCount,
              error: null,
            }));
          },
          onParticipantCount: (data) => {
            if (!mounted) return;
            setState((s) => ({ ...s, participantCount: data.count }));
          },
          onChatMessage: (data: ChatMessagePayload) => {
            if (!mounted) return;
            const uid = currentUserIdRef.current;
            setState((s) => {
              // Skip our own messages - we already show them optimistically
              if (uid && data.participantId === uid) return s;
              // Fallback: skip if we already have our own message with same content (handles participantId mismatch)
              if (s.chatMessages.some((m) => m.isOwn && m.content === data.content)) return s;
              const msg: ChatMessage = {
                id: data.id,
                participantId: data.participantId,
                participantName: data.participantName,
                content: data.content,
                isOwn: false,
              };
              return { ...s, chatMessages: [...s.chatMessages, msg] };
            });
          },
          onError: (data) => {
            if (!mounted) return;
            if (data.code === 'ROOM_FULL') {
              setState((s) => ({ ...s, error: 'Room is full. Maximum 7 participants.' }));
            } else {
              setState((s) => ({ ...s, error: data.message }));
            }
          },
        });

        if (!mounted) return;
        setState((s) => ({ ...s, isConnected: true, roomId, error: null }));
        joinRoom(roomId);
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to connect. Using offline mode.';
        setState((s) => ({
          ...s,
          error: msg,
          roomName: roomType.charAt(0).toUpperCase() + roomType.slice(1),
        }));
      }
    };

    connect();

    return () => {
      mounted = false;
      if (resolvedRoomId) {
        leaveRoom();
        disconnectSocket();
      }
      setState({
        roomId: null,
        roomName: null,
        participantCount: 0,
        chatMessages: [],
        isConnected: false,
        isJoined: false,
        error: null,
      });
    };
  }, [roomType, currentUserId]);

  return {
    ...state,
    sendChatMessage,
  };
}
