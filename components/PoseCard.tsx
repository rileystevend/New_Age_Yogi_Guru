import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Pose } from '@/types/pose';
import { PoseIllustration } from '@/components/PoseIllustration';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const difficultyColors: Record<string, string> = {
  beginner: '#6B8E5A',
  intermediate: '#D4A843',
  advanced: '#C44B4B',
};

const difficultyLabels: Record<string, string> = {
  beginner: '●',
  intermediate: '●●',
  advanced: '●●●',
};

interface PoseCardProps {
  pose: Pose;
  onPress: () => void;
}

export function PoseCard({ pose, onPress }: PoseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={styles.illustration}>
        <PoseIllustration poseId={pose.id} size={48} />
      </View>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={[styles.englishName, { color: colors.text }]} numberOfLines={1}>
            {pose.englishName}
          </Text>
          <Text
            style={[
              styles.difficulty,
              { color: difficultyColors[pose.difficulty] },
            ]}>
            {difficultyLabels[pose.difficulty]}
          </Text>
        </View>
        <Text style={[styles.sanskritName, { color: colors.warmGray }]} numberOfLines={1}>
          {pose.sanskritName}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.cream }]}>
            <Text style={[styles.categoryText, { color: colors.terracottaDark }]}>
              {pose.category.replace('-', ' ')}
            </Text>
          </View>
          {pose.bodyFocus.slice(0, 2).map((bf) => (
            <Text key={bf} style={[styles.focusTag, { color: colors.sage }]}>
              {bf}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.chevron}>
        <Text style={{ color: colors.warmGray, fontSize: 18 }}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  illustration: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  englishName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  difficulty: {
    fontSize: 10,
    marginLeft: 8,
  },
  sanskritName: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  focusTag: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  chevron: {
    marginLeft: 8,
  },
});
