import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { GeneratedSequence, GeneratedPose } from '@/services';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface SequenceDisplayProps {
  sequence: GeneratedSequence;
}

export function SequenceDisplay({ sequence }: SequenceDisplayProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const totalPoses =
    sequence.warmUp.length +
    sequence.mainSequence.length +
    sequence.coolDown.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={[styles.name, { color: colors.text }]}>{sequence.name}</Text>
      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        {sequence.style} • {sequence.durationMinutes}min • {sequence.difficulty} • {totalPoses} poses
      </Text>
      {sequence.intention ? (
        <Text style={[styles.intention, { color: colors.sage }]}>
          "{sequence.intention}"
        </Text>
      ) : null}

      {/* Warm Up */}
      {sequence.warmUp.length > 0 && (
        <>
          <Text style={[styles.sectionHeader, { color: colors.tint }]}>
            🌅 Warm Up
          </Text>
          {sequence.warmUp.map((pose, i) => (
            <PoseItem key={`wu-${i}`} pose={pose} colors={colors} />
          ))}
        </>
      )}

      {/* Main Sequence */}
      {sequence.mainSequence.length > 0 && (
        <>
          <Text style={[styles.sectionHeader, { color: colors.tint }]}>
            🔥 Main Sequence
          </Text>
          {sequence.mainSequence.map((pose, i) => (
            <PoseItem key={`ms-${i}`} pose={pose} colors={colors} />
          ))}
        </>
      )}

      {/* Cool Down */}
      {sequence.coolDown.length > 0 && (
        <>
          <Text style={[styles.sectionHeader, { color: colors.tint }]}>
            🌙 Cool Down
          </Text>
          {sequence.coolDown.map((pose, i) => (
            <PoseItem key={`cd-${i}`} pose={pose} colors={colors} />
          ))}
        </>
      )}

      {/* Closing Notes */}
      {sequence.closingNotes ? (
        <View
          style={[
            styles.closingNotes,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Text style={[styles.closingTitle, { color: colors.sage }]}>
            📝 Teacher Notes
          </Text>
          <Text style={[styles.closingText, { color: colors.text }]}>
            {sequence.closingNotes}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function PoseItem({
  pose,
  colors,
}: {
  pose: GeneratedPose;
  colors: typeof Colors.light;
}) {
  return (
    <View
      style={[
        styles.poseCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
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
  container: {},
  name: { fontSize: 22, fontWeight: '700' },
  meta: { fontSize: 14, marginTop: 4 },
  intention: { fontSize: 14, fontStyle: 'italic', marginTop: 4, marginBottom: 8 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  poseCard: { padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  poseHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  poseName: { fontSize: 15, fontWeight: '600' },
  poseSanskrit: { fontSize: 12, fontStyle: 'italic' },
  poseDetail: { fontSize: 12, marginTop: 2, marginBottom: 6 },
  poseCue: { fontSize: 13, lineHeight: 19, marginLeft: 8 },
  poseTransition: { fontSize: 12, marginTop: 6, fontStyle: 'italic' },
  closingNotes: { padding: 16, borderRadius: 12, borderWidth: 1, marginTop: 16 },
  closingTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  closingText: { fontSize: 13, lineHeight: 20 },
});
