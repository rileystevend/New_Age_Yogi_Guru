import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';

import { getPoseCount, getSequenceCount } from '@/db';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const db = useSQLiteContext();
  const { user, signOut } = useAuth();

  const [poseCount, setPoseCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  const loadStats = useCallback(async () => {
    const [poses, classes] = await Promise.all([
      getPoseCount(db),
      getSequenceCount(db),
    ]);
    setPoseCount(poses);
    setClassCount(classes);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>🧘</Text>
      <Text style={[styles.title, { color: colors.text }]}>
        New Age Yogi Guru
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Your AI-powered yoga class companion
      </Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>
            {poseCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.warmGray }]}>
            Poses
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.sage }]}>
            {classCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.warmGray }]}>
            Saved Classes
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.cardContainer}>
        <Pressable
          onPress={() => router.push('/poses')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            🌿 Browse Poses
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Explore {poseCount} yoga poses with teaching cues
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/builder')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            ✨ Build a Class
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Let AI compose the perfect yoga sequence
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/portfolio')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            📁 Your Portfolio
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            {classCount > 0
              ? `${classCount} saved class${classCount !== 1 ? 'es' : ''}`
              : 'Save and organize your class sequences'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/chat')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            💬 Ask Your Guru
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Get answers about sequencing, anatomy, and teaching
          </Text>
        </Pressable>
      </View>

      {/* Account */}
      <Pressable onPress={signOut} style={styles.signOutRow}>
        <Text style={[styles.signOutEmail, { color: colors.warmGray }]}>
          {user?.email}
        </Text>
        <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  cardContainer: {
    width: '100%',
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardText: {
    fontSize: 13,
    lineHeight: 19,
  },
  signOutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    paddingVertical: 8,
  },
  signOutEmail: {
    fontSize: 12,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
