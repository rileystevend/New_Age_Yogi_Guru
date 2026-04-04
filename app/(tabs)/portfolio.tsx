import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useRouter } from 'expo-router';

import { getAllSequences, deleteSequence } from '@/db';
import type { SavedSequence } from '@/db';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PortfolioScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();
  const router = useRouter();

  const [sequences, setSequences] = useState<SavedSequence[]>([]);

  const loadSequences = useCallback(async () => {
    const result = await getAllSequences(db);
    setSequences(result);
  }, [db]);

  // Reload when screen gains focus (e.g. after saving from builder)
  useFocusEffect(
    useCallback(() => {
      loadSequences();
    }, [loadSequences])
  );

  const handleDelete = useCallback(
    (seq: SavedSequence) => {
      Alert.alert(
        'Delete Class',
        `Delete "${seq.name}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteSequence(db, seq.id);
              loadSequences();
            },
          },
        ]
      );
    },
    [db, loadSequences]
  );

  if (sequences.length === 0) {
    return (
      <View
        style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyEmoji}>📁</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No saved classes yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Build a class and save it to start your portfolio
        </Text>
        <Pressable
          onPress={() => router.push('/builder')}
          style={[styles.ctaButton, { backgroundColor: colors.tint }]}>
          <Text style={styles.ctaButtonText}>✨ Build a Class</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={sequences}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/sequence/[id]',
                params: { id: item.id },
              })
            }
            onLongPress={() => handleDelete(item)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}>
            <View style={styles.cardContent}>
              <Text
                style={[styles.cardName, { color: colors.text }]}
                numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                {item.style} • {item.durationMinutes}min • {item.difficulty}
              </Text>
              <Text style={[styles.cardDate, { color: colors.warmGray }]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              {item.focusAreas.length > 0 && (
                <View style={styles.focusTags}>
                  {item.focusAreas.slice(0, 3).map((area) => (
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
            <Text style={{ color: colors.warmGray, fontSize: 18 }}>›</Text>
          </Pressable>
        )}
        ListHeaderComponent={
          <Text style={[styles.countText, { color: colors.warmGray }]}>
            {sequences.length} saved class{sequences.length !== 1 ? 'es' : ''}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  listContent: { paddingBottom: 20 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', marginBottom: 24 },
  ctaButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  countText: {
    fontSize: 13,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardContent: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600' },
  cardMeta: { fontSize: 13, marginTop: 2 },
  cardDate: { fontSize: 12, marginTop: 2 },
  focusTags: { flexDirection: 'row', gap: 6, marginTop: 6 },
  focusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  focusTagText: { fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
});
