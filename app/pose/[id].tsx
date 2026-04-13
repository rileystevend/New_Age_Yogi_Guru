import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { getPoseById, deletePose, isCustomPose } from '@/db';
import { Pose } from '@/types/pose';
import { PoseIllustration } from '@/components/PoseIllustration';
import { NotesSection } from '@/components/NotesSection';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();
  const router = useRouter();
  const [pose, setPose] = useState<Pose | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getPoseById(db, id);
      setPose(result);
      setLoading(false);
    }
    load();
  }, [db, id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!pose) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={[styles.errorEmoji]}>🤷</Text>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Pose not found
        </Text>
        <Text style={[styles.errorHint, { color: colors.warmGray }]}>
          ID: {id}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ title: pose.englishName }} />

      {/* Pose illustration */}
      <View style={[styles.illustrationContainer, { backgroundColor: colors.sand }]}>
        <PoseIllustration poseId={pose.id} size={160} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.englishName, { color: colors.text }]}>
          {pose.englishName}
        </Text>
        <Text style={[styles.sanskritName, { color: colors.tint }]}>
          {pose.sanskritName}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {pose.description}
        </Text>
      </View>

      {/* Quick reference */}
      <View style={styles.quickRef}>
        <View style={[styles.quickRefItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.quickRefLabel, { color: colors.warmGray }]}>Category</Text>
          <Text style={[styles.quickRefValue, { color: colors.text }]}>
            {pose.category.replace('-', ' ')}
          </Text>
        </View>
        <View style={[styles.quickRefItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.quickRefLabel, { color: colors.warmGray }]}>Difficulty</Text>
          <Text style={[styles.quickRefValue, { color: colors.text }]}>
            {pose.difficulty}
          </Text>
        </View>
        <View style={[styles.quickRefItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.quickRefLabel, { color: colors.warmGray }]}>Drishti</Text>
          <Text style={[styles.quickRefValue, { color: colors.text }]}>
            {pose.drishti}
          </Text>
        </View>
      </View>

      {/* Breath cue */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.sage }]}>🌬️ Breath</Text>
        <Text style={[styles.sectionText, { color: colors.text }]}>
          {pose.breathCue}
        </Text>
      </View>

      {/* Teaching cues */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.tint }]}>
          🎙️ Teaching Cues
        </Text>
        {pose.teachingCues.map((cue, index) => (
          <View key={index} style={styles.cueRow}>
            <Text style={[styles.cueNumber, { color: colors.tint }]}>
              {index + 1}
            </Text>
            <Text style={[styles.cueText, { color: colors.text }]}>{cue}</Text>
          </View>
        ))}
      </View>

      {/* Body focus */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.sage }]}>
          🎯 Body Focus
        </Text>
        <View style={styles.tagContainer}>
          {pose.bodyFocus.map((bf) => (
            <View key={bf} style={[styles.tag, { backgroundColor: colors.cream }]}>
              <Text style={[styles.tagText, { color: colors.sageDark }]}>
                {bf}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contraindications */}
      {pose.contraindications.length > 0 && (
        <View style={[styles.section, { backgroundColor: '#FFF5F5', borderColor: '#FFD0D0' }]}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>
            ⚠️ Contraindications
          </Text>
          {pose.contraindications.map((c, i) => (
            <Text key={i} style={[styles.contraindicationText, { color: '#8B3030' }]}>
              • {c}
            </Text>
          ))}
        </View>
      )}

      {/* Notes */}
      <NotesSection entityId={pose.id} entityType="pose" />

      {/* Tags */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.warmGray }]}>
          🏷️ Tags
        </Text>
        <View style={styles.tagContainer}>
          {pose.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.tagText, { color: colors.warmGray }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Delete button — custom poses only */}
      {isCustomPose(pose.id) && (
        <Pressable
          onPress={() => {
            Alert.alert(
              'Delete Pose',
              `Delete "${pose.englishName}"? This cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await deletePose(db, pose.id);
                    router.back();
                  },
                },
              ]
            );
          }}
          style={[styles.deleteButton, { borderColor: colors.error }]}>
          <Text style={[styles.deleteButtonText, { color: colors.error }]}>
            🗑️ Delete Custom Pose
          </Text>
        </Pressable>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
  },
  errorHint: {
    fontSize: 14,
    marginTop: 4,
  },
  illustrationContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  englishName: {
    fontSize: 28,
    fontWeight: '700',
  },
  sanskritName: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  quickRef: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  quickRefItem: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickRefLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickRefValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  cueRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cueNumber: {
    fontSize: 14,
    fontWeight: '700',
    width: 24,
    marginTop: 1,
  },
  cueText: {
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  contraindicationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  deleteButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
