import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { addCustomPose } from '@/db';
import type {
  PoseCategory,
  Difficulty,
  BodyFocus,
} from '@/types/pose';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// ── Options ────────────────────────────────────────────────

const CATEGORIES: { value: PoseCategory; label: string }[] = [
  { value: 'standing', label: 'Standing' },
  { value: 'seated', label: 'Seated' },
  { value: 'supine', label: 'Supine' },
  { value: 'prone', label: 'Prone' },
  { value: 'backbend', label: 'Backbend' },
  { value: 'forward-fold', label: 'Forward Fold' },
  { value: 'twist', label: 'Twist' },
  { value: 'balance', label: 'Balance' },
  { value: 'inversion', label: 'Inversion' },
  { value: 'arm-balance', label: 'Arm Balance' },
  { value: 'restorative', label: 'Restorative' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const BODY_FOCUS_OPTIONS: { value: BodyFocus; label: string }[] = [
  { value: 'hips', label: 'Hips' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'spine', label: 'Spine' },
  { value: 'core', label: 'Core' },
  { value: 'chest', label: 'Chest' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'full-body', label: 'Full Body' },
  { value: 'neck', label: 'Neck' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'ankles', label: 'Ankles' },
  { value: 'wrists', label: 'Wrists' },
];

// ── Screen ─────────────────────────────────────────────────

export default function CreatePoseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();
  const router = useRouter();

  // Required
  const [englishName, setEnglishName] = useState('');
  const [sanskritName, setSanskritName] = useState('');
  const [category, setCategory] = useState<PoseCategory>('standing');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [description, setDescription] = useState('');
  const [bodyFocus, setBodyFocus] = useState<BodyFocus[]>([]);
  const [isBilateral, setIsBilateral] = useState(false);

  // Teaching cues (start with one empty field)
  const [cues, setCues] = useState<string[]>(['']);

  // Optional
  const [drishti, setDrishti] = useState('');
  const [breathCue, setBreathCue] = useState('');
  const [contraindications, setContraindications] = useState('');
  const [tags, setTags] = useState('');

  const [saving, setSaving] = useState(false);

  const toggleBodyFocus = useCallback((bf: BodyFocus) => {
    setBodyFocus((prev) =>
      prev.includes(bf) ? prev.filter((x) => x !== bf) : [...prev, bf]
    );
  }, []);

  const updateCue = useCallback((index: number, text: string) => {
    setCues((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  }, []);

  const addCue = useCallback(() => {
    setCues((prev) => [...prev, '']);
  }, []);

  const removeCue = useCallback((index: number) => {
    setCues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validate = (): string | null => {
    if (!englishName.trim()) return 'Pose name is required.';
    if (!description.trim()) return 'Description is required.';
    if (bodyFocus.length === 0) return 'Select at least one body focus area.';
    const realCues = cues.filter((c) => c.trim());
    if (realCues.length === 0) return 'Add at least one teaching cue.';
    return null;
  };

  const handleSave = useCallback(async () => {
    const error = validate();
    if (error) {
      Alert.alert('Missing info', error);
      return;
    }

    try {
      setSaving(true);
      const id = await addCustomPose(db, {
        englishName: englishName.trim(),
        sanskritName: sanskritName.trim() || englishName.trim(),
        category,
        difficulty,
        bodyFocus,
        description: description.trim(),
        teachingCues: cues.filter((c) => c.trim()).map((c) => c.trim()),
        contraindications: contraindications
          .split('\n')
          .map((c) => c.trim())
          .filter(Boolean),
        tags: tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        drishti: drishti.trim() || 'forward',
        breathCue: breathCue.trim() || 'Breathe naturally.',
        isBilateral,
      });

      router.replace({ pathname: '/pose/[id]', params: { id } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Save failed', msg);
      setSaving(false);
    }
  }, [
    db,
    router,
    englishName,
    sanskritName,
    category,
    difficulty,
    bodyFocus,
    description,
    cues,
    contraindications,
    tags,
    drishti,
    breathCue,
    isBilateral,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Stack.Screen
          options={{
            title: 'New Pose',
            headerShown: true,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} hitSlop={10}>
                <Text style={[styles.headerAction, { color: colors.tint }]}>
                  Cancel
                </Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={handleSave}
                disabled={saving}
                hitSlop={10}>
                <Text
                  style={[
                    styles.headerAction,
                    {
                      color: saving ? colors.warmGray : colors.tint,
                      fontWeight: '600',
                    },
                  ]}>
                  {saving ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>
            ),
          }}
        />

        {/* ── Pose Name ──────────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>
          Pose Name <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <TextInput
          value={englishName}
          onChangeText={setEnglishName}
          placeholder="e.g. Wild Thing"
          placeholderTextColor={colors.warmGray}
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          autoCapitalize="words"
        />

        {/* ── Sanskrit Name ──────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>Sanskrit Name</Text>
        <TextInput
          value={sanskritName}
          onChangeText={setSanskritName}
          placeholder="e.g. Camatkarasana"
          placeholderTextColor={colors.warmGray}
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          autoCapitalize="words"
        />

        {/* ── Category ───────────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>
          Category <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <View style={styles.chipGrid}>
          {CATEGORIES.map((cat) => {
            const active = category === cat.value;
            return (
              <Pressable
                key={cat.value}
                onPress={() => setCategory(cat.value)}
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
                    { color: active ? '#FFF' : colors.text },
                  ]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Difficulty ─────────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>
          Difficulty <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.value;
            return (
              <Pressable
                key={d.value}
                onPress={() => setDifficulty(d.value)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.tint : colors.surface,
                    borderColor: active ? colors.tint : colors.border,
                    flex: 1,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#FFF' : colors.text },
                  ]}>
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Description ────────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>
          Description <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description of the pose"
          placeholderTextColor={colors.warmGray}
          style={[
            styles.input,
            styles.multiline,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* ── Body Focus ─────────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>
          Body Focus <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <View style={styles.chipGrid}>
          {BODY_FOCUS_OPTIONS.map((bf) => {
            const active = bodyFocus.includes(bf.value);
            return (
              <Pressable
                key={bf.value}
                onPress={() => toggleBodyFocus(bf.value)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.sage : colors.surface,
                    borderColor: active ? colors.sage : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#FFF' : colors.text },
                  ]}>
                  {bf.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Bilateral Toggle ────────────────── */}
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.text, marginBottom: 0 }]}>
              Bilateral (done on both sides)
            </Text>
          </View>
          <Switch
            value={isBilateral}
            onValueChange={setIsBilateral}
            trackColor={{ false: colors.border, true: colors.sage }}
            thumbColor="#FFF"
          />
        </View>

        {/* ── Teaching Cues ───────────────────── */}
        <Text style={[styles.label, { color: colors.text }]}>
          Teaching Cues <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <Text style={[styles.hint, { color: colors.warmGray }]}>
          What you'd say to a student in this pose
        </Text>
        {cues.map((cue, i) => (
          <View key={i} style={styles.cueRow}>
            <Text style={[styles.cueNumber, { color: colors.tint }]}>{i + 1}</Text>
            <TextInput
              value={cue}
              onChangeText={(text) => updateCue(i, text)}
              placeholder={`Cue ${i + 1}`}
              placeholderTextColor={colors.warmGray}
              style={[
                styles.input,
                { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
              ]}
              multiline
            />
            {cues.length > 1 && (
              <Pressable
                onPress={() => removeCue(i)}
                hitSlop={8}
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, padding: 8 }]}>
                <Text style={{ color: colors.error, fontSize: 18 }}>✕</Text>
              </Pressable>
            )}
          </View>
        ))}
        <Pressable
          onPress={addCue}
          style={({ pressed }) => [
            styles.addCueButton,
            {
              borderColor: colors.tint,
              opacity: pressed ? 0.6 : 1,
            },
          ]}>
          <Text style={[styles.addCueText, { color: colors.tint }]}>+ Add Cue</Text>
        </Pressable>

        {/* ── Optional Fields ─────────────────── */}
        <View style={[styles.optionalSection, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.warmGray }]}>
            Optional
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Drishti (gaze point)</Text>
          <TextInput
            value={drishti}
            onChangeText={setDrishti}
            placeholder="e.g. upward, forward, tip of nose"
            placeholderTextColor={colors.warmGray}
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          />

          <Text style={[styles.label, { color: colors.text }]}>Breath Cue</Text>
          <TextInput
            value={breathCue}
            onChangeText={setBreathCue}
            placeholder="e.g. Inhale to lift, exhale to fold"
            placeholderTextColor={colors.warmGray}
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          />

          <Text style={[styles.label, { color: colors.text }]}>Contraindications</Text>
          <Text style={[styles.hint, { color: colors.warmGray }]}>
            One per line
          </Text>
          <TextInput
            value={contraindications}
            onChangeText={setContraindications}
            placeholder="e.g. Knee injury&#10;High blood pressure"
            placeholderTextColor={colors.warmGray}
            style={[
              styles.input,
              styles.multiline,
              { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
            ]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { color: colors.text }]}>Tags</Text>
          <Text style={[styles.hint, { color: colors.warmGray }]}>
            Comma-separated for search
          </Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="e.g. hip-opener, strength, balance"
            placeholderTextColor={colors.warmGray}
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  headerAction: { fontSize: 16, paddingHorizontal: 12 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    marginBottom: 6,
    marginTop: -2,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
  },
  multiline: {
    minHeight: 72,
    paddingTop: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  cueNumber: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    width: 20,
    textAlign: 'center',
  },
  addCueButton: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 4,
  },
  addCueText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionalSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bottomSpacer: { height: 60 },
});
