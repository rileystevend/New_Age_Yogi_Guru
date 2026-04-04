import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { PoseCategory } from '@/types/pose';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/** Human-readable labels for categories */
const categoryLabels: Record<PoseCategory, string> = {
  standing: 'Standing',
  seated: 'Seated',
  supine: 'Supine',
  prone: 'Prone',
  inversion: 'Inversions',
  balance: 'Balance',
  twist: 'Twists',
  backbend: 'Backbends',
  'forward-fold': 'Forward Folds',
  'arm-balance': 'Arm Balances',
  restorative: 'Restorative',
};

interface CategoryFilterProps {
  categories: PoseCategory[];
  selected: PoseCategory | null;
  onSelect: (category: PoseCategory | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const allCategories: Array<PoseCategory | 'all'> = ['all', ...categories];

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={allCategories}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const isAll = item === 'all';
        const isSelected = isAll ? selected === null : selected === item;
        const label = isAll ? 'All' : categoryLabels[item as PoseCategory];

        return (
          <Pressable
            onPress={() => onSelect(isAll ? null : (item as PoseCategory))}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.tint : colors.surface,
                borderColor: isSelected ? colors.tint : colors.border,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : colors.text },
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
