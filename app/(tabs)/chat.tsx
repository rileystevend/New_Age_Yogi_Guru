import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { sendMessageStreaming, sendMessage, ClaudeAPIError } from '@/services';
import type { ClaudeMessage } from '@/services';
import { YOGA_TEACHER_SYSTEM_PROMPT } from '@/services/prompts';

const IS_TUNNEL = Platform.OS !== 'web';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MAX_HISTORY = 20;

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isStreaming) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsStreaming(true);
    scrollToBottom();

    // Build Claude message history (last MAX_HISTORY messages)
    const history: ClaudeMessage[] = [...messages, userMsg]
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));

    const assistantId = `msg-${Date.now() + 1}`;
    // Add empty assistant message that we'll stream into
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      if (IS_TUNNEL) {
        // Non-streaming for tunnel to avoid timeout
        const response = await sendMessage(
          history,
          YOGA_TEACHER_SYSTEM_PROMPT,
          4096
        );
        const text = response.content[0]?.text ?? '';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: text } : m
          )
        );
        scrollToBottom();
      } else {
        await sendMessageStreaming(
          history,
          YOGA_TEACHER_SYSTEM_PROMPT,
          (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk }
                  : m
              )
            );
            scrollToBottom();
          }
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof ClaudeAPIError
          ? `Connection error (${err.status})`
          : err instanceof Error
            ? err.message
            : 'Something went wrong';
      setError(errorMsg);

      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
      scrollToBottom();
    }
  }, [inputText, isStreaming, messages, scrollToBottom]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user';
      return (
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            {
              backgroundColor: isUser ? colors.tint : colors.surface,
              borderColor: isUser ? colors.tint : colors.border,
            },
          ]}>
          {!isUser && (
            <Text style={[styles.senderLabel, { color: colors.sage }]}>
              🧘 Yogi Guru
            </Text>
          )}
          <Text
            style={[
              styles.messageText,
              { color: isUser ? '#FFFFFF' : colors.text },
            ]}>
            {item.content}
            {isStreaming &&
              item.role === 'assistant' &&
              item.content.length > 0 &&
              item.id === messages[messages.length - 1]?.id
              ? '▌'
              : ''}
          </Text>
        </View>
      );
    },
    [colors, isStreaming, messages]
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🧘</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Ask Your Yogi Guru
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Ask anything about yoga teaching — sequencing, anatomy, modifications,
            cues, class themes, or teaching methodology.
          </Text>
          <View style={styles.suggestions}>
            {[
              'How do I safely transition from Warrior II to Triangle?',
              'What are good hip openers for beginners?',
              'How should I sequence a 60-minute yin class?',
            ].map((suggestion, i) => (
              <Pressable
                key={i}
                onPress={() => setInputText(suggestion)}
                style={[
                  styles.suggestionChip,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                <Text style={[styles.suggestionText, { color: colors.text }]}>
                  {suggestion}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
        />
      )}

      {/* Error */}
      {error && (
        <View style={[styles.errorBar, { backgroundColor: '#FFF5F5' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            ⚠️ {error}
          </Text>
        </View>
      )}

      {/* Input */}
      <View
        style={[
          styles.inputBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}>
        <TextInput
          style={[
            styles.textInput,
            {
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about yoga teaching..."
          placeholderTextColor={colors.warmGray}
          multiline
          maxLength={2000}
          editable={!isStreaming}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          disabled={!inputText.trim() || isStreaming}
          style={[
            styles.sendButton,
            {
              backgroundColor:
                inputText.trim() && !isStreaming ? colors.tint : colors.warmGray,
            },
          ]}>
          <Text style={styles.sendButtonText}>
            {isStreaming ? '...' : '↑'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 8 },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  suggestions: { width: '100%', gap: 8 },
  suggestionChip: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionText: { fontSize: 14, lineHeight: 20 },
  errorBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: { fontSize: 13 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
