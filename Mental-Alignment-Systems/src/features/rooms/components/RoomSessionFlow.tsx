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
import { RoomSessionState, RoomSession, ClosingChoice } from '../types';
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
  const [intention, setIntention] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [shares, setShares] = useState<Array<{ participantId: string; participantName: string; content: string }>>([]);
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
    handleStateChange('body_awareness_audio');
  };

  const handleBodyAwarenessComplete = () => {
    handleStateChange('room_entry_note');
  };

  const handleRoomEntryNoteComplete = () => {
    handleStateChange('relaxation_cards');
  };

  const handleRelaxationCardsComplete = () => {
    handleStateChange('intention_setting');
  };

  const handleArrivalComplete = () => {
    handleStateChange('reflection_questions');
  };

  const handleReflectionQuestionsComplete = () => {
    handleStateChange('breathing');
  };

  const handleBreathingComplete = () => {
    handleStateChange('intention_setting');
  };

  const handleIntentionComplete = (intentionText: string) => {
    setIntention(intentionText);
    handleStateChange('card_selection');
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleCardSelectionComplete = () => {
    handleStateChange('sharing');
  };

  const handleShare = (content: string) => {
    setShares(prev => [
      ...prev,
      {
        participantId: 'participant-1',
        participantName: 'You',
        content,
      },
    ]);
  };

  const handleSharingComplete = () => {
    handleStateChange('closing');
  };

  const handleClosingChoice = (choice: ClosingChoice) => {
    // Handle closing choice
    // In real implementation, would show reading or play audio
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  // Resolve the current phase content (no background here — background mounts once below)
  const currentPhase = (() => {
    switch (currentState) {
      case 'breathing_activity':
        return <BreathingActivityPhase onComplete={handleBreathingActivityComplete} />;

      case 'body_awareness_audio':
        return <BodyAwarenessPlayerPhase onComplete={handleBodyAwarenessComplete} />;

      case 'room_entry_note':
        return <RoomEntryNotePhase onComplete={handleRoomEntryNoteComplete} />;

      case 'relaxation_cards':
        return <RelaxationCardsPhase onComplete={handleRelaxationCardsComplete} />;

      case 'arrival':
        return (
          <ArrivalPhase
            roomName={session.roomType.charAt(0).toUpperCase() + session.roomType.slice(1)}
            roomType={session.roomType}
            onComplete={handleArrivalComplete}
          />
        );

      case 'reflection_questions':
        return (
          <ReflectionQuestionsPhase
            roomType={session.roomType}
            onComplete={handleReflectionQuestionsComplete}
          />
        );

      case 'breathing':
        return <BreathingPhase onComplete={handleBreathingComplete} />;

      case 'intention_setting':
        return <IntentionSettingPhase onComplete={handleIntentionComplete} />;

      case 'card_selection':
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

      case 'sharing':
        return (
          <SharingPhase
            selectedCardContent={selectedCard?.content || ''}
            onShare={handleShare}
            onSkip={handleSharingComplete}
            onComplete={handleSharingComplete}
            existingShares={shares}
          />
        );

      case 'closing':
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
