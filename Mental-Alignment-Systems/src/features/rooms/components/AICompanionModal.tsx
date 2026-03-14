/**
 * AI Companion Modal
 *
 * A warm, personal AI companion for the room.
 * Sends messages to the backend Mistral-powered endpoint.
 * Keeps per-user memory so it remembers context across sessions.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/shared/ui';
import { sendCompanionMessage } from '@/services/ai/companionService';

interface CompanionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AICompanionModalProps {
  visible: boolean;
  onClose: () => void;
}

const GREETING_MESSAGES = [
  "Hey... I'm here. No rush, take your time.",
  "Hi. This is your space. Say anything, or nothing at all.",
  "I'm here with you. Whenever you're ready.",
  "Hey. How are you doing right now?",
  "Welcome back. I'm here if you want to talk.",
];

function getGreeting(): string {
  return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
}

export function AICompanionModal({ visible, onClose }: AICompanionModalProps) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && !hasGreeted) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: getGreeting(),
        },
      ]);
      setHasGreeted(true);
    }
  }, [visible, hasGreeted]);

  useEffect(() => {
    if (visible && messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [visible, messages.length]);

  const handleSend = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: CompanionMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await sendCompanionMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "I'm having trouble connecting right now. I'm still here though.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

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
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.companionDot} />
                <View>
                  <Text style={styles.title}>Companion</Text>
                  <Text style={styles.subtitle}>
                    {isLoading ? 'thinking...' : 'here with you'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
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
                onContentSizeChange={() =>
                  scrollRef.current?.scrollToEnd({ animated: false })
                }
              >
                {messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      msg.role === 'user' ? styles.messageUser : styles.messageAI,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.content}</Text>
                  </View>
                ))}
                {isLoading && (
                  <View style={[styles.messageBubble, styles.messageAI]}>
                    <View style={styles.typingRow}>
                      <View style={[styles.typingDot, styles.dot1]} />
                      <View style={[styles.typingDot, styles.dot2]} />
                      <View style={[styles.typingDot, styles.dot3]} />
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Input */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Say anything..."
                  placeholderTextColor="rgba(255, 255, 255, 0.35)"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  style={[
                    styles.sendButton,
                    (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                  ]}
                  activeOpacity={0.7}
                  disabled={!inputText.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
                  ) : (
                    <MaterialIcons
                      name="send"
                      size={20}
                      color={
                        inputText.trim()
                          ? '#FFFFFF'
                          : 'rgba(255,255,255,0.35)'
                      }
                    />
                  )}
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
    backgroundColor: 'rgba(20, 18, 35, 0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(139, 92, 246, 0.15)',
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
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6EE7B7',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 1,
  },
  messagesList: {
    flex: 1,
    minHeight: 200,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '85%',
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderBottomRightRadius: 4,
  },
  messageAI: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 22,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.1)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});
