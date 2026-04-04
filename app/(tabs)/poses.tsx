import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PosesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.emoji]}>🌿</Text>
      <Text style={[styles.title, { color: colors.text }]}>Pose Library</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Browse yoga poses with images, Sanskrit names, and teaching cues.
      </Text>
      <View style={[styles.placeholder, { borderColor: colors.border }]}>
        <Text style={[styles.placeholderText, { color: colors.warmGray }]}>
          Coming in Milestone 1 — Slice S02 & S03
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  placeholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});
