import React, { useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { generateSequence, ClaudeAPIError } from '@/services';
import type { GeneratedSequence, SequenceGenerationParams } from '@/services';
import { ChipSelector } from '@/components/ChipSelector';
import { SequenceDisplay } from '@/components/SequenceDisplay';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const STYLES = [
  { value: 'vinyasa', label: 'Vinyasa' },
  { value: 'hatha', label: 'Hatha' },
  { value: 'yin', label: 'Yin' },
  { value: 'restorative', label: 'Restorative' },
  { value: 'power', label: 'Power' },
  { value: 'ashtanga', label: 'Ashtanga' },
] as const;

const DURATIONS = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '75', label: '75 min' },
  { value: '90', label: '90 min' },
] as const;

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const FOCUS_AREAS = [
  { value: 'hips', label: 'Hips' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'spine', label: 'Spine' },
  { value: 'core', label: 'Core' },
  { value: 'chest', label: 'Chest' },
  { value: 'legs', label: 'Legs' },
  { value: 'full-body', label: 'Full Body' },
] as const;

type Phase = 'form' | 'generating' | 'result';

export default function BuilderScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Form state
  const [style, setStyle] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [intention, setIntention] = useState('');

  // Generation state
  const [phase, setPhase] = useState<Phase>('form');
  const [streamingText, setStreamingText] = useState('');
  const [sequence, setSequence] = useState<GeneratedSequence | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = useMemo(
    () => style && duration && difficulty && focusAreas.length > 0,
    [style, duration, difficulty, focusAreas]
  );

  const handleFocusToggle = useCallback((area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!style || !duration || !difficulty || focusAreas.length === 0) return;

    const params: SequenceGenerationParams = {
      style,
      durationMinutes: parseInt(duration, 10),
      difficulty,
      focusAreas,
      intention: intention.trim() || undefined,
    };

    setPhase('generating');
    setStreamingText('');
    setSequence(null);
    setError(null);

    const startTime = Date.now();

    try {
      const result = await generateSequence(params, (chunk) => {
        setStreamingText((prev) => prev + chunk);
      });
      setSequence(result);
      setPhase('result');

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const totalPoses =
        result.warmUp.length +
        result.mainSequence.length +
        result.coolDown.length;
      console.log(
        `[Builder] Generated "${result.name}" — ${totalPoses} poses in ${elapsed}s (${params.style}/${params.durationMinutes}min/${params.difficulty})`
      );
    } catch (err) {
      if (err instanceof ClaudeAPIError) {
        setError(`AI error (${err.status}): ${err.message}`);
      } else {
        setError(
          err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        );
      }
      setPhase('form');
      console.error('[Builder] Generation failed:', err);
    }
  }, [style, duration, difficulty, focusAreas, intention]);

  const handleNewClass = useCallback(() => {
    setPhase('form');
    setSequence(null);
    setStreamingText('');
    setError(null);
  }, []);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  // ── Form View ─────────────────────────────────────────────
  if (phase === 'form') {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>
            ✨ Build a Class
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose your parameters and let AI compose the sequence
          </Text>

          <ChipSelector
            label="Style"
            options={[...STYLES]}
            selected={style}
            onSelect={setStyle}
            horizontal
          />

          <ChipSelector
            label="Duration"
            options={[...DURATIONS]}
            selected={duration}
            onSelect={setDuration}
            horizontal
          />

          <ChipSelector
            label="Difficulty"
            options={[...DIFFICULTIES]}
            selected={difficulty}
            onSelect={setDifficulty}
          />

          <ChipSelector
            label="Focus Areas (select one or more)"
            options={[...FOCUS_AREAS]}
            selected={focusAreas}
            onSelect={handleFocusToggle}
            multiple
          />

          {/* Intention input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Intention / Theme (optional)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              value={intention}
              onChangeText={setIntention}
              placeholder="e.g. hip opening for runners, stress relief, heart opening..."
              placeholderTextColor={colors.warmGray}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Error display */}
          {error && (
            <View style={[styles.errorCard, { borderColor: colors.error }]}>
              <Text style={[styles.errorTitle, { color: colors.error }]}>
                ⚠️ {error}
              </Text>
            </View>
          )}

          {/* Generate button */}
          <Pressable
            onPress={handleGenerate}
            disabled={!isFormValid}
            style={({ pressed }) => [
              styles.generateButton,
              {
                backgroundColor: isFormValid
                  ? pressed
                    ? colors.terracottaDark
                    : colors.tint
                  : colors.warmGray,
              },
            ]}>
            <Text style={styles.generateButtonText}>🧘 Generate Sequence</Text>
          </Pressable>

          {!isFormValid && (
            <Text style={[styles.validationHint, { color: colors.warmGray }]}>
              Select style, duration, difficulty, and at least one focus area
            </Text>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Generating View ───────────────────────────────────────
  if (phase === 'generating') {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.generatingTitle, { color: colors.text }]}>
          Composing your class...
        </Text>
        <Text style={[styles.generatingHint, { color: colors.textSecondary }]}>
          {style} • {duration}min • {difficulty}
        </Text>
        {streamingText.length > 0 && (
          <View
            style={[
              styles.streamPreview,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.streamText, { color: colors.warmGray }]}>
              {streamingText.length > 200
                ? '...' + streamingText.slice(-200)
                : streamingText}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ── Result View ───────────────────────────────────────────
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      {/* Action bar */}
      <View style={styles.actionBar}>
        <Pressable
          onPress={handleNewClass}
          style={[styles.actionButton, { borderColor: colors.border }]}>
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            ← New Class
          </Text>
        </Pressable>
        <Pressable
          onPress={handleRegenerate}
          style={[styles.actionButton, { borderColor: colors.tint }]}>
          <Text style={[styles.actionButtonText, { color: colors.tint }]}>
            🔄 Regenerate
          </Text>
        </Pressable>
      </View>

      {sequence && <SequenceDisplay sequence={sequence} />}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  errorCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#FFF5F5',
    marginBottom: 12,
  },
  errorTitle: { fontSize: 13, fontWeight: '500' },
  generateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  validationHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  generatingTitle: { fontSize: 20, fontWeight: '600', marginTop: 20 },
  generatingHint: { fontSize: 14, marginTop: 4 },
  streamPreview: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
  },
  streamText: { fontSize: 11, fontFamily: 'SpaceMono', lineHeight: 16 },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: { fontSize: 14, fontWeight: '500' },
  bottomSpacer: { height: 40 },
});
