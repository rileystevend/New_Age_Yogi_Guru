import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { Pose, PoseCategory } from '@/types/pose';
import {
  getAllPoses,
  searchPoses as dbSearchPoses,
  getPosesByCategory as dbGetPosesByCategory,
  getAvailableCategories as dbGetAvailableCategories,
} from '@/db';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PoseCard } from '@/components/PoseCard';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PosesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const db = useSQLiteContext();

  const [allPoses, setAllPoses] = useState<Pose[]>([]);
  const [filteredPoses, setFilteredPoses] = useState<Pose[]>([]);
  const [categories, setCategories] = useState<PoseCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<PoseCategory | null>(null);

  // Load on focus so custom poses added on /pose/create show up
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      async function load() {
        const [poses, cats] = await Promise.all([
          getAllPoses(db),
          dbGetAvailableCategories(db),
        ]);
        if (cancelled) return;
        setAllPoses(poses);
        setFilteredPoses(poses);
        setCategories(cats);
      }
      load();
      return () => {
        cancelled = true;
      };
    }, [db])
  );

  // Apply filters
  useEffect(() => {
    async function filter() {
      let result: Pose[];

      if (searchQuery) {
        result = await dbSearchPoses(db, searchQuery);
      } else if (selectedCategory) {
        result = await dbGetPosesByCategory(db, selectedCategory);
      } else {
        result = allPoses;
      }

      // Apply both filters together if both are set
      if (searchQuery && selectedCategory) {
        result = result.filter((p) => p.category === selectedCategory);
      }

      setFilteredPoses(result);
    }
    filter();
  }, [searchQuery, selectedCategory, allPoses, db]);

  const handlePosePress = useCallback(
    (poseId: string) => {
      router.push({ pathname: '/pose/[id]', params: { id: poseId } });
    },
    [router]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <FlatList
        data={filteredPoses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PoseCard pose={item} onPress={() => handlePosePress(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.warmGray }]}>
              No poses found
              {searchQuery ? ` for "${searchQuery}"` : ''}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.warmGray }]}>
              Try a different search or clear the filters
            </Text>
          </View>
        }
      />
      {/* Floating add button */}
      <Pressable
        onPress={() => router.push('/pose/create')}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.tint, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -2,
  },
});
