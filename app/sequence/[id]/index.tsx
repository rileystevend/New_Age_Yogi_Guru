import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useFocusEffect,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { getSequenceById, deleteSequence } from '@/db';
import type { SavedSequence } from '@/db';
import { SequenceDisplay } from '@/components/SequenceDisplay';
import { NotesSection } from '@/components/NotesSection';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SequenceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();
  const router = useRouter();

  const [sequence, setSequence] = useState<SavedSequence | null>(null);
  const [loading, setLoading] = useState(true);

  // Re-fetch on focus so edits made in /edit show up when the user returns.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      async function load() {
        const result = await getSequenceById(db, id);
        if (cancelled) return;
        setSequence(result);
        setLoading(false);
      }
      load();
      return () => {
        cancelled = true;
      };
    }, [db, id])
  );

  const handleDelete = () => {
    if (!sequence) return;
    Alert.alert(
      'Delete Class',
      `Delete "${sequence.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSequence(db, sequence.id);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!sequence) {
    return (
      <View
        style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={styles.errorEmoji}>🤷</Text>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Class not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: sequence.name }} />

      {/* Meta info */}
      <View style={[styles.metaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          Saved {new Date(sequence.createdAt).toLocaleDateString()}
        </Text>
        {sequence.focusAreas.length > 0 && (
          <View style={styles.focusTags}>
            {sequence.focusAreas.map((area) => (
              <View
                key={area}
                style={[styles.focusTag, { backgroundColor: colors.cream }]}>
                <Text
                  style={[styles.focusTagText, { color: colors.sageDark }]}>
                  {area}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <SequenceDisplay sequence={sequence.posesJson} />

      {/* Edit button */}
      <Pressable
        onPress={() => router.push(`/sequence/${sequence.id}/edit`)}
        style={({ pressed }) => [
          styles.editButton,
          { backgroundColor: colors.tint, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={styles.editButtonText}>✏️ Edit Class</Text>
      </Pressable>

      {/* Notes */}
      <NotesSection entityId={sequence.id} entityType="sequence" />

      {/* Delete button */}
      <Pressable
        onPress={handleDelete}
        style={[styles.deleteButton, { borderColor: colors.error }]}>
        <Text style={[styles.deleteButtonText, { color: colors.error }]}>
          🗑️ Delete Class
        </Text>
      </Pressable>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorText: { fontSize: 18, fontWeight: '600' },
  metaCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  metaText: { fontSize: 13 },
  focusTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  focusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  focusTagText: { fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
  editButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteButtonText: { fontSize: 14, fontWeight: '500' },
  bottomSpacer: { height: 40 },
});
