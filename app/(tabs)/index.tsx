import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.emoji]}>🧘</Text>
      <Text style={[styles.title, { color: colors.text }]}>
        New Age Yogi Guru
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Your AI-powered yoga class companion
      </Text>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            🌿 Browse Poses
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Explore our library of yoga poses with teaching cues
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            ✨ Build a Class
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Let AI help you compose the perfect yoga sequence
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.tint }]}>
            📁 Your Portfolio
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Save and organize your class sequences
          </Text>
        </View>
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
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  cardContainer: {
    width: '100%',
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
