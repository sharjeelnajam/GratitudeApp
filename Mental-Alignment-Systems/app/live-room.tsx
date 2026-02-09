/**
 * Live Room Example
 * Minimal Expo client: join, listen, leave.
 * Connects to backend via Socket.IO, joins room, shows participant count.
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '@/shared/ui';
import { useLiveRoom } from '@/features/rooms/hooks/useLiveRoom';
import { fetchRooms } from '@/services/room';
import type { RoomListItem } from '@/services/room';

const ROOM_NAME_MAP: Record<string, string> = {
  fireplace: 'Fireplace',
  ocean: 'Ocean',
  forest: 'Forest',
  nightSky: 'NightSky',
};

export default function LiveRoomScreen() {
  const router = useRouter();
  const { room: roomType, roomId: paramRoomId } = useLocalSearchParams<{
    room?: string;
    roomId?: string;
  }>();
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    paramRoomId ?? null
  );

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  useEffect(() => {
    if (paramRoomId) {
      setSelectedRoomId(paramRoomId);
      return;
    }
    if (roomType && rooms.length > 0) {
      const name = ROOM_NAME_MAP[roomType ?? ''] ?? roomType;
      const match = rooms.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      if (match) setSelectedRoomId(match.id);
    }
  }, [roomType, paramRoomId, rooms]);

  const live = useLiveRoom(selectedRoomId);

  const handleLeave = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#1E1B2E', '#2D1B3D', '#3B2F4D']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Guided Alignment Room</Text>
        <Text style={styles.subtitle}>
          {live.roomName ?? roomType ?? 'Connecting…'}
        </Text>

        {live.error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{live.error}</Text>
          </View>
        ) : null}

        {live.isConnected && !live.isJoined ? (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color="#A78BFA" />
            <Text style={styles.statusText}>Joining room…</Text>
          </View>
        ) : null}

        {live.isJoined ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Participants</Text>
            <Text style={styles.participantCount}>{live.participantCount} / 7</Text>
            <Text style={styles.stateLabel}>
              Session: {live.sessionState ?? '—'}
            </Text>
          </View>
        ) : null}

        {!selectedRoomId && rooms.length > 0 ? (
          <View style={styles.roomList}>
            <Text style={styles.roomListTitle}>Select a room</Text>
            {rooms.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.roomButton, !r.canJoin && styles.roomButtonDisabled]}
                onPress={() => r.canJoin && setSelectedRoomId(r.id)}
                disabled={!r.canJoin}
              >
                <Text style={styles.roomButtonText}>
                  {r.name} ({r.participantCount}/7)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.leaveButton}
          onPress={handleLeave}
          activeOpacity={0.8}
        >
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
  },
  errorBox: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#FCA5A5',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusBox: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  participantCount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#A78BFA',
    marginBottom: 8,
  },
  stateLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  roomList: {
    width: '100%',
    marginBottom: 32,
  },
  roomListTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  roomButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  roomButtonDisabled: {
    opacity: 0.5,
  },
  roomButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  leaveButton: {
    marginTop: 'auto',
    marginBottom: 48,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FCA5A5',
  },
});
