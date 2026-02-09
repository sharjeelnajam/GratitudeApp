/**
 * Guided Alignment Room Screen
 * 
 * Full Guided Alignment Room session flow.
 * Arrival → Breathing → Intention → Cards → Sharing → Closing
 */

import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { RoomThemeId } from '@/theme/roomThemes';
import { RoomSessionFlow } from '@/features/rooms/components/RoomSessionFlow';
import { createMockRoomSession } from '@/features/rooms/mockData';
import { useRoomSession } from '@/features/rooms/hooks/useRoomSession';
import { RoomSessionState } from '@/features/rooms/types';

export default function GuidedRoomScreen() {
  const { roomType } = useLocalSearchParams<{ roomType: string }>();
  const { setRoomTheme } = useTheme();
  const router = useRouter();
  const roomSession = useRoomSession(roomType ?? null);

  // Validate and set room theme
  const validRoomTypes: RoomThemeId[] = ['fireplace', 'ocean', 'forest', 'nightSky', 'default'];
  const roomThemeId = (validRoomTypes.includes(roomType as RoomThemeId))
    ? (roomType as RoomThemeId)
    : 'default';

  // Create mock session — start with 32s breathing activity
  const [session] = useState(() =>
    createMockRoomSession(roomThemeId as 'fireplace' | 'ocean' | 'forest' | 'nightSky', 'breathing_activity')
  );

  useEffect(() => {
    // Apply room theme when entering
    if (setRoomTheme) {
      setRoomTheme(roomThemeId);
    }

    // Cleanup: reset to default when leaving
    return () => {
      if (setRoomTheme) {
        setRoomTheme('default');
      }
    };
  }, [roomType, setRoomTheme]);

  const handleStateChange = (state: RoomSessionState) => {
    // Update session state if needed
    console.log('State changed to:', state);
  };

  const handleComplete = () => {
    router.push('/close');
  };

  return (
    <RoomSessionFlow
      session={session}
      onStateChange={handleStateChange}
      onComplete={handleComplete}
      chatMessages={roomSession.chatMessages}
      onChatSend={roomSession.sendChatMessage}
      participantCount={roomSession.isJoined ? roomSession.participantCount : Math.max(1, roomSession.participantCount)}
      isChatOnline={roomSession.isJoined}
    />
  );
}
