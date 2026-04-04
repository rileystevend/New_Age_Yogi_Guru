import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { generateSequence, ClaudeAPIError } from '@/services';
import type { GeneratedSequence, SequenceGenerationParams } from '@/services';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const TEST_PARAMS: SequenceGenerationParams = {
  style: 'vinyasa',
  durationMinutes: 30,
  difficulty: 'beginner',
  focusAreas: ['hips', 'hamstrings'],
  intention: 'gentle hip opening for new practitioners',
};

export default function BuilderScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sequence, setSequence] = useState<GeneratedSequence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setStreamingText('');
    setSequence(null);
    setError(null);

    try {
      const result = await generateSequence(TEST_PARAMS, (chunk) => {
        setStreamingText((prev) => prev + chunk);
      });
      setSequence(result);
      console.log(
        `[Builder] Generated sequence: ${result.name} — ${result.warmUp.length + result.mainSequence.length + result.coolDown.length} poses`
      );
    } catch (err) {
      if (err instanceof ClaudeAPIError) {
        setError(`Claude API error (${err.status}): ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
      console.error('[Builder] Generation failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>✨ Class Builder</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        AI-powered yoga class composition
      </Text>

      {/* Test parameters display */}
      <View style={[styles.paramCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.paramTitle, { color: colors.tint }]}>Test Parameters</Text>
        <Text style={[styles.paramText, { color: colors.text }]}>
          Style: {TEST_PARAMS.style} • Duration: {TEST_PARAMS.durationMinutes}min
        </Text>
        <Text style={[styles.paramText, { color: colors.text }]}>
          Difficulty: {TEST_PARAMS.difficulty} • Focus: {TEST_PARAMS.focusAreas.join(', ')}
        </Text>
        <Text style={[styles.paramText, { color: colors.textSecondary }]}>
          Intention: {TEST_PARAMS.intention}
        </Text>
      </View>

      {/* Generate button */}
      <Pressable
        onPress={handleGenerate}
        disabled={loading}
        style={({ pressed }) => [
          styles.generateButton,
          {
            backgroundColor: loading ? colors.warmGray : colors.tint,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.generateButtonText}>🧘 Generate Sequence</Text>
        )}
      </Pressable>

      {/* Error display */}
      {error && (
        <View style={[styles.errorCard, { borderColor: colors.error }]}>
          <Text style={[styles.errorTitle, { color: colors.error }]}>⚠️ Error</Text>
          <Text style={[styles.errorText, { color: '#8B3030' }]}>{error}</Text>
        </View>
      )}

      {/* Streaming text (raw) — shown while generating */}
      {loading && streamingText.length > 0 && (
        <View style={[styles.streamCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.streamLabel, { color: colors.warmGray }]}>
            ⏳ Streaming from Claude...
          </Text>
          <Text style={[styles.streamText, { color: colors.text }]}>
            {streamingText.slice(-500)}
          </Text>
        </View>
      )}

      {/* Parsed sequence display */}
      {sequence && (
        <View style={styles.sequenceContainer}>
          <Text style={[styles.sequenceName, { color: colors.text }]}>
            {sequence.name}
          </Text>
          <Text style={[styles.sequenceMeta, { color: colors.textSecondary }]}>
            {sequence.style} • {sequence.durationMinutes}min • {sequence.difficulty}
          </Text>
          <Text style={[styles.sequenceIntention, { color: colors.sage }]}>
            "{sequence.intention}"
          </Text>

          {/* Warm Up */}
          <SectionHeader title="🌅 Warm Up" color={colors.tint} />
          {sequence.warmUp.map((pose, i) => (
            <PoseItem key={`wu-${i}`} pose={pose} colors={colors} />
          ))}

          {/* Main Sequence */}
          <SectionHeader title="🔥 Main Sequence" color={colors.tint} />
          {sequence.mainSequence.map((pose, i) => (
            <PoseItem key={`ms-${i}`} pose={pose} colors={colors} />
          ))}

          {/* Cool Down */}
          <SectionHeader title="🌙 Cool Down" color={colors.tint} />
          {sequence.coolDown.map((pose, i) => (
            <PoseItem key={`cd-${i}`} pose={pose} colors={colors} />
          ))}

          {/* Closing Notes */}
          {sequence.closingNotes && (
            <View style={[styles.closingNotes, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.closingNotesTitle, { color: colors.sage }]}>
                📝 Teacher Notes
              </Text>
              <Text style={[styles.closingNotesText, { color: colors.text }]}>
                {sequence.closingNotes}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <Text style={[styles.sectionHeader, { color }]}>{title}</Text>
  );
}

function PoseItem({
  pose,
  colors,
}: {
  pose: { englishName: string; sanskritName: string; holdBreaths: number; side: string; teachingCues: string[]; transitionNote: string };
  colors: typeof Colors.light;
}) {
  return (
    <View style={[styles.poseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.poseHeader}>
        <Text style={[styles.poseName, { color: colors.text }]}>
          {pose.englishName}
        </Text>
        <Text style={[styles.poseSanskrit, { color: colors.warmGray }]}>
          {pose.sanskritName}
        </Text>
      </View>
      <Text style={[styles.poseDetail, { color: colors.textSecondary }]}>
        {pose.holdBreaths} breaths
        {pose.side !== 'none' ? ` • ${pose.side} side` : ''}
      </Text>
      {pose.teachingCues.map((cue, i) => (
        <Text key={i} style={[styles.poseCue, { color: colors.text }]}>
          • {cue}
        </Text>
      ))}
      {pose.transitionNote ? (
        <Text style={[styles.poseTransition, { color: colors.sage }]}>
          → {pose.transitionNote}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 20 },
  paramCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  paramTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  paramText: { fontSize: 13, lineHeight: 20 },
  generateButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  generateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  errorCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#FFF5F5',
    marginBottom: 16,
  },
  errorTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  errorText: { fontSize: 13, lineHeight: 20 },
  streamCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  streamLabel: { fontSize: 12, marginBottom: 8 },
  streamText: { fontSize: 12, fontFamily: 'SpaceMono', lineHeight: 18 },
  sequenceContainer: { marginTop: 8 },
  sequenceName: { fontSize: 22, fontWeight: '700' },
  sequenceMeta: { fontSize: 14, marginTop: 4 },
  sequenceIntention: { fontSize: 14, fontStyle: 'italic', marginTop: 4, marginBottom: 16 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  poseCard: { padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  poseHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  poseName: { fontSize: 15, fontWeight: '600' },
  poseSanskrit: { fontSize: 12, fontStyle: 'italic' },
  poseDetail: { fontSize: 12, marginTop: 2, marginBottom: 6 },
  poseCue: { fontSize: 13, lineHeight: 19, marginLeft: 8 },
  poseTransition: { fontSize: 12, marginTop: 6, fontStyle: 'italic' },
  closingNotes: { padding: 16, borderRadius: 12, borderWidth: 1, marginTop: 16 },
  closingNotesTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  closingNotesText: { fontSize: 13, lineHeight: 20 },
  bottomSpacer: { height: 40 },
});
