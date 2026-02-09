/**
 * Room Chat Modal
 *
 * Popup modal for in-room chat. Users can send messages and see others' messages.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/shared/ui';

export interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  content: string;
  isOwn?: boolean;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  messages?: ChatMessage[];
  onSend?: (content: string) => void;
  participantCount?: number;
  isOnline?: boolean;
}

export function ChatModal({
  visible,
  onClose,
  messages: externalMessages,
  onSend,
  participantCount = 0,
  isOnline = true,
}: ChatModalProps) {
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const messages = externalMessages ?? localMessages;

  useEffect(() => {
    if (visible && messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [visible, messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (onSend) {
      onSend(trimmed);
    } else {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          participantId: 'me',
          participantName: 'You',
          content: trimmed,
          isOwn: true,
        },
      ]);
    }
    setInputText('');
  };

  const { height } = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable
            style={[styles.modalContent, { maxHeight: height * 0.9 }]}
            onPress={(e) => e.stopPropagation()}
          >
          {/* Header - fixed at top, outside KeyboardAvoidingView */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Room Chat</Text>
              <Text style={styles.participantCount}>
                {participantCount}/7 participants{!isOnline && ' (offline)'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={24} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>

          {/* Messages + Input - KeyboardAvoidingView only wraps this */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              ref={scrollRef}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
            >
              {messages.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={40}
                    color="rgba(255,255,255,0.25)"
                  />
                  <Text style={styles.emptyText}>
                    Send a message to connect with others in the room.
                  </Text>
                </View>
              ) : (
                messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      msg.isOwn ? styles.messageOwn : styles.messageOther,
                    ]}
                  >
                    {!msg.isOwn && (
                      <Text style={styles.messageSender} numberOfLines={1}>
                        {msg.participantName}
                      </Text>
                    )}
                    <Text style={styles.messageText}>{msg.content}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                activeOpacity={0.7}
                disabled={!inputText.trim()}
              >
                <MaterialIcons
                  name="send"
                  size={20}
                  color={inputText.trim() ? '#FFFFFF' : 'rgba(255,255,255,0.35)'}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardRoot: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 46, 0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  participantCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
    minHeight: 200,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 12,
    textAlign: 'center',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '85%',
  },
  messageOwn: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
    borderBottomRightRadius: 4,
  },
  messageOther: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(167, 139, 250, 0.95)',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
