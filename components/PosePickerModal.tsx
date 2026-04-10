import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { getAllPoses } from '@/db';
import type { Pose, PoseCategory } from '@/types/pose';
import { PoseIllustration } from '@/components/PoseIllustration';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface PosePickerModalProps {
  visible: boolean;
  title?: string;
  /** Called when the user picks a pose. */
  onPick: (pose: Pose) => void;
  onClose: () => void;
}

const CATEGORIES: Array<PoseCategory | 'all'> = [
  'all',
  'standing',
  'seated',
  'supine',
  'prone',
  'backbend',
  'forward-fold',
  'twist',
  'balance',
  'inversion',
  'arm-balance',
  'restorative',
];

export function PosePickerModal({
  visible,
  title = 'Choose a Pose',
  onPick,
  onClose,
}: PosePickerModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();

  const [allPoses, setAllPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PoseCategory | 'all'>('all');

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      const poses = await getAllPoses(db);
      if (cancelled) return;
      setAllPoses(poses);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [db, visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPoses.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.englishName.toLowerCase().includes(q) ||
        p.sanskritName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [allPoses, query, category]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Text style={[styles.close, { color: colors.tint }]}>Cancel</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search poses…"
            placeholderTextColor={colors.warmGray}
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {/* Category chips */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => {
            const active = category === item;
            return (
              <Pressable
                onPress={() => setCategory(item)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.tint : colors.surface,
                    borderColor: active ? colors.tint : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#FFFFFF' : colors.text },
                  ]}>
                  {item === 'all' ? 'All' : item.replace('-', ' ')}
                </Text>
              </Pressable>
            );
          }}
        />

        {/* Results */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(p) => p.id}
            ItemSeparatorComponent={() => (
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
            )}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={[styles.empty, { color: colors.warmGray }]}>
                  No poses match that search.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onPick(item)}
                style={({ pressed }) => [
                  styles.row,
                  { opacity: pressed ? 0.6 : 1 },
                ]}>
                <PoseIllustration poseId={item.id} size={44} />
                <View style={styles.rowText}>
                  <Text style={[styles.poseName, { color: colors.text }]} numberOfLines={1}>
                    {item.englishName}
                  </Text>
                  <Text
                    style={[styles.poseSanskrit, { color: colors.warmGray }]}
                    numberOfLines={1}>
                    {item.sanskritName} · {item.category.replace('-', ' ')}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 18, fontWeight: '600' },
  close: { fontSize: 16, fontWeight: '500' },
  searchContainer: { paddingHorizontal: 20, paddingTop: 12 },
  searchInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
  },
  chipRow: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  rowText: { flex: 1 },
  poseName: { fontSize: 15, fontWeight: '600' },
  poseSanskrit: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 76 },
  centered: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 14 },
});
