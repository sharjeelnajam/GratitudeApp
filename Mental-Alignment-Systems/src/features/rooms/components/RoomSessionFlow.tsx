/**
 * Room Session Flow
 *
 * Complete flow for Guided Alignment Room session.
 * Manages all phases: Arrival → Breathing → Intention → Cards → Sharing → Closing
 * Chat icon (bottom right) on all screens; tap to open chat modal.
 */

import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { RoomSessionState, RoomSession, ClosingChoice, SharingEntry } from '../types';
import { LiveEffectVideoBackground } from './LiveEffectVideoBackground';
import { FireRoomParallaxBackground } from './FireRoomParallaxBackground';
import { BreathingActivityPhase } from './BreathingActivityPhase';
import { BodyAwarenessPlayerPhase } from './BodyAwarenessPlayerPhase';
import { RoomEntryNotePhase } from './RoomEntryNotePhase';
import { RelaxationCardsPhase } from './RelaxationCardsPhase';
import { ArrivalPhase } from './ArrivalPhase';
import { ReflectionQuestionsPhase } from './ReflectionQuestionsPhase';
import { BreathingPhase } from './BreathingPhase';
import { IntentionSettingPhase } from './IntentionSettingPhase';
import { CardSelectionPhase } from './CardSelectionPhase';
import { SharingPhase } from './SharingPhase';
import { ClosingPhase } from './ClosingPhase';
import { ChatModal, ChatMessage } from './ChatModal';
import { AICompanionModal } from './AICompanionModal';
import { ShareRoomButton } from './ShareRoomButton';

interface RoomSessionFlowProps {
  session: RoomSession;
  onStateChange: (state: RoomSessionState) => void;
  onComplete: () => void;
  chatMessages?: ChatMessage[];
  onChatSend?: (content: string) => void;
  participantCount?: number;
  isChatOnline?: boolean;
}

export function RoomSessionFlow({
  session,
  onStateChange,
  onComplete,
  chatMessages: externalChatMessages,
  onChatSend,
  participantCount = 0,
  isChatOnline = true,
}: RoomSessionFlowProps) {
  const insets = useSafeAreaInsets();
  const [currentState, setCurrentState] = useState<RoomSessionState>(session.state);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [shares, setShares] = useState<SharingEntry[]>([]);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [companionModalVisible, setCompanionModalVisible] = useState(false);
  const [localChatMessages, setLocalChatMessages] = useState<ChatMessage[]>([]);

  const chatMessages = externalChatMessages ?? localChatMessages;
  const handleChatSend = onChatSend ?? ((content: string) => {
    setLocalChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        participantId: 'me',
        participantName: 'You',
        content,
        isOwn: true,
      },
    ]);
  });

  const selectedCard = session.cards.find(c => c.id === selectedCardId);

  const handleStateChange = (newState: RoomSessionState) => {
    setCurrentState(newState);
    onStateChange(newState);
  };

  const handleBreathingActivityComplete = () => {
    handleStateChange(RoomSessionState.BODY_AWARENESS_AUDIO);
  };

  const handleBodyAwarenessComplete = () => {
    handleStateChange(RoomSessionState.ROOM_ENTRY_NOTE);
  };

  const handleRoomEntryNoteComplete = () => {
    handleStateChange(RoomSessionState.RELAXATION_CARDS);
  };

  const handleRelaxationCardsComplete = () => {
    handleStateChange(RoomSessionState.INTENTION_SETTING);
  };

  const handleArrivalComplete = () => {
    handleStateChange(RoomSessionState.REFLECTION_QUESTIONS);
  };

  const handleReflectionQuestionsComplete = () => {
    handleStateChange(RoomSessionState.BREATHING);
  };

  const handleBreathingComplete = () => {
    handleStateChange(RoomSessionState.INTENTION_SETTING);
  };

  const handleIntentionComplete = () => {
    handleStateChange(RoomSessionState.CARD_SELECTION);
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleCardSelectionComplete = () => {
    handleStateChange(RoomSessionState.SHARING);
  };

  const handleShare = (content: string) => {
    setShares(prev => [
      ...prev,
      {
        participantId: 'participant-1',
        participantName: 'You',
        content,
        sharedAt: new Date(),
      },
    ]);
  };

  const handleSharingComplete = () => {
    handleStateChange(RoomSessionState.CLOSING);
  };

  const handleClosingChoice = (_choice: ClosingChoice) => {
    // Handle closing choice
    // In real implementation, would show reading or play audio
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  // Resolve the current phase content (no background here — background mounts once below)
  const currentPhase = (() => {
    switch (currentState) {
      case RoomSessionState.BREATHING_ACTIVITY:
        return <BreathingActivityPhase onComplete={handleBreathingActivityComplete} />;

      case RoomSessionState.BODY_AWARENESS_AUDIO:
        return <BodyAwarenessPlayerPhase onComplete={handleBodyAwarenessComplete} />;

      case RoomSessionState.ROOM_ENTRY_NOTE:
        return <RoomEntryNotePhase onComplete={handleRoomEntryNoteComplete} />;

      case RoomSessionState.RELAXATION_CARDS:
        return <RelaxationCardsPhase onComplete={handleRelaxationCardsComplete} />;

      case RoomSessionState.ARRIVAL:
        return (
          <ArrivalPhase
            roomName={session.roomType.charAt(0).toUpperCase() + session.roomType.slice(1)}
            roomType={session.roomType}
            onComplete={handleArrivalComplete}
          />
        );

      case RoomSessionState.REFLECTION_QUESTIONS:
        return (
          <ReflectionQuestionsPhase
            roomType={session.roomType}
            onComplete={handleReflectionQuestionsComplete}
          />
        );

      case RoomSessionState.BREATHING:
        return <BreathingPhase onComplete={handleBreathingComplete} />;

      case RoomSessionState.INTENTION_SETTING:
        return <IntentionSettingPhase onComplete={handleIntentionComplete} />;

      case RoomSessionState.CARD_SELECTION:
        return (
          <CardSelectionPhase
            cards={session.cards}
            participants={session.participants}
            currentShufflerIndex={session.currentShufflerIndex}
            onShuffle={() => {}}
            onCardSelect={handleCardSelect}
            onComplete={handleCardSelectionComplete}
          />
        );

      case RoomSessionState.SHARING:
        return (
          <SharingPhase
            selectedCardContent={selectedCard?.content || ''}
            onShare={handleShare}
            onSkip={handleSharingComplete}
            onComplete={handleSharingComplete}
            existingShares={shares}
          />
        );

      case RoomSessionState.CLOSING:
        return <ClosingPhase onChoice={handleClosingChoice} />;

      default:
        return null;
    }
  })();

  // Background mounts ONCE for the entire session so gyro/yaw state persists across phase transitions.
  return (
    <View style={styles.wrapper}>
      {session.roomType === 'fireplace' ? (
        <FireRoomParallaxBackground>
          {currentPhase}
        </FireRoomParallaxBackground>
      ) : (
        <LiveEffectVideoBackground>
          {currentPhase}
        </LiveEffectVideoBackground>
      )}
      <ShareRoomButton
        roomType={session.roomType}
        style={[styles.shareIconButton, { top: Math.max(insets.top, 12) }]}
      />
      <TouchableOpacity
        style={[styles.companionIconButton, { bottom: Math.max(insets.bottom, 24) }]}
        onPress={() => setCompanionModalVisible(true)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="self-improvement" size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.chatIconButton, { bottom: Math.max(insets.bottom, 24) }]}
        onPress={() => setChatModalVisible(true)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="chat-bubble-outline" size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <AICompanionModal
        visible={companionModalVisible}
        onClose={() => setCompanionModalVisible(false)}
      />
      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        messages={chatMessages}
        onSend={handleChatSend}
        participantCount={participantCount}
        isOnline={isChatOnline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  shareIconButton: {
    position: 'absolute',
    right: 24,
    zIndex: 20,
  },
  companionIconButton: {
    position: 'absolute',
    left: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(110, 231, 183, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110, 231, 183, 0.3)',
  },
  chatIconButton: {
    position: 'absolute',
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(139, 92, 246, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
