import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ChipSelectorProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selected: T | T[] | null;
  onSelect: (value: T) => void;
  /** Allow multiple selections. Default: false (single select). */
  multiple?: boolean;
  /** Scroll horizontally. Default: false (wrap). */
  horizontal?: boolean;
}

export function ChipSelector<T extends string>({
  label,
  options,
  selected,
  onSelect,
  multiple = false,
  horizontal = false,
}: ChipSelectorProps<T>) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isSelected = (value: T): boolean => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const chips = options.map((opt) => {
    const active = isSelected(opt.value);
    return (
      <Pressable
        key={opt.value}
        onPress={() => onSelect(opt.value)}
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
          {opt.label}
        </Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}>
          {chips}
        </ScrollView>
      ) : (
        <View style={styles.wrapContent}>{chips}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  horizontalContent: {
    gap: 8,
  },
  wrapContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
