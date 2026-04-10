import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import {
  getSequenceById,
  updateSequence,
  getAllPoses,
  type SavedSequence,
} from '@/db';
import type { GeneratedPose, GeneratedSequence } from '@/services/types';
import type { Pose } from '@/types/pose';
import { PoseIllustration } from '@/components/PoseIllustration';
import { PosePickerModal } from '@/components/PosePickerModal';
import {
  libraryPoseToGeneratedPose,
  findLibraryPoseId,
} from '@/lib/poseConversion';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// ── Flat editor item model ────────────────────────────────
// The sequence has three logical sections (warm-up / main / cool-down) but to
// support cross-section dragging we flatten everything into a single list with
// inline section markers. On save we rebuild the three buckets from whatever
// poses ended up under each marker.

type SectionKey = 'warmUp' | 'mainSequence' | 'coolDown';

type EditorItem =
  | {
      key: string;
      kind: 'section';
      section: SectionKey;
      label: string;
    }
  | {
      key: string;
      kind: 'pose';
      pose: GeneratedPose;
      libraryPoseId: string | null;
    };

const SECTION_LABELS: Record<SectionKey, string> = {
  warmUp: '🌅 Warm Up',
  mainSequence: '🔥 Main Sequence',
  coolDown: '🌙 Cool Down',
};

function flattenSequence(seq: GeneratedSequence, library: Pose[]): EditorItem[] {
  const items: EditorItem[] = [];
  let poseCounter = 0;

  const pushSection = (section: SectionKey) => {
    items.push({
      key: `section-${section}`,
      kind: 'section',
      section,
      label: SECTION_LABELS[section],
    });
  };

  const pushPoses = (poses: GeneratedPose[]) => {
    for (const pose of poses) {
      items.push({
        key: `pose-${poseCounter++}-${pose.englishName}`,
        kind: 'pose',
        pose,
        libraryPoseId: findLibraryPoseId(pose, library),
      });
    }
  };

  pushSection('warmUp');
  pushPoses(seq.warmUp);
  pushSection('mainSequence');
  pushPoses(seq.mainSequence);
  pushSection('coolDown');
  pushPoses(seq.coolDown);

  return items;
}

function rebuildSequence(
  original: GeneratedSequence,
  items: EditorItem[]
): GeneratedSequence {
  const buckets: Record<SectionKey, GeneratedPose[]> = {
    warmUp: [],
    mainSequence: [],
    coolDown: [],
  };
  let currentSection: SectionKey = 'warmUp';

  for (const item of items) {
    if (item.kind === 'section') {
      currentSection = item.section;
    } else {
      buckets[currentSection].push(item.pose);
    }
  }

  return {
    ...original,
    warmUp: buckets.warmUp,
    mainSequence: buckets.mainSequence,
    coolDown: buckets.coolDown,
  };
}

/** Ensure the three section markers are present and in order. */
function normalizeItems(items: EditorItem[]): EditorItem[] {
  const seenSections = new Set<SectionKey>();
  const filtered: EditorItem[] = [];

  for (const item of items) {
    if (item.kind === 'section') {
      if (seenSections.has(item.section)) continue; // drop duplicates
      seenSections.add(item.section);
    }
    filtered.push(item);
  }

  // Ensure all three sections exist, in the correct order.
  // Any poses that end up before the first section go into warmUp.
  const ensureOrder: SectionKey[] = ['warmUp', 'mainSequence', 'coolDown'];
  const result: EditorItem[] = [];
  let sectionIdx = 0;
  let insertedAny = false;

  for (const item of filtered) {
    if (item.kind === 'section') {
      // Catch up on missing earlier sections
      while (sectionIdx < ensureOrder.length && ensureOrder[sectionIdx] !== item.section) {
        const missing = ensureOrder[sectionIdx];
        result.push({
          key: `section-${missing}`,
          kind: 'section',
          section: missing,
          label: SECTION_LABELS[missing],
        });
        sectionIdx++;
        insertedAny = true;
      }
      result.push(item);
      sectionIdx++;
      insertedAny = true;
    } else {
      if (!insertedAny) {
        // Poses floating before any section — stick them after warmUp marker
        result.push({
          key: `section-warmUp`,
          kind: 'section',
          section: 'warmUp',
          label: SECTION_LABELS.warmUp,
        });
        sectionIdx = 1;
        insertedAny = true;
      }
      result.push(item);
    }
  }

  // Append any sections still missing at the end
  while (sectionIdx < ensureOrder.length) {
    const missing = ensureOrder[sectionIdx];
    result.push({
      key: `section-${missing}`,
      kind: 'section',
      section: missing,
      label: SECTION_LABELS[missing],
    });
    sectionIdx++;
  }

  return result;
}

// ── Screen ─────────────────────────────────────────────────

export default function EditSequenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const db = useSQLiteContext();
  const router = useRouter();

  const [sequence, setSequence] = useState<SavedSequence | null>(null);
  const [items, setItems] = useState<EditorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Pose picker state
  const [pickerMode, setPickerMode] = useState<
    | { type: 'add'; afterKey: string | null }
    | { type: 'swap'; targetKey: string }
    | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [seq, library] = await Promise.all([
        getSequenceById(db, id),
        getAllPoses(db),
      ]);
      if (cancelled) return;
      if (!seq) {
        setLoading(false);
        return;
      }
      setSequence(seq);
      setItems(flattenSequence(seq.posesJson, library));
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [db, id]);

  const handleDragEnd = useCallback(({ data }: { data: EditorItem[] }) => {
    const normalized = normalizeItems(data);
    setItems(normalized);
    setDirty(true);
  }, []);

  const handleRemove = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
    setDirty(true);
  }, []);

  const handleSwapRequest = useCallback((key: string) => {
    setPickerMode({ type: 'swap', targetKey: key });
  }, []);

  const handleAddRequest = useCallback((afterKey: string | null) => {
    setPickerMode({ type: 'add', afterKey });
  }, []);

  const handlePickerPick = useCallback(
    (libraryPose: Pose) => {
      if (!pickerMode) return;
      const generated = libraryPoseToGeneratedPose(libraryPose);

      setItems((prev) => {
        if (pickerMode.type === 'swap') {
          return prev.map((item) => {
            if (item.kind === 'pose' && item.key === pickerMode.targetKey) {
              return {
                ...item,
                // New key so React re-renders illustration + any caches
                key: `pose-swap-${Date.now()}-${libraryPose.id}`,
                pose: generated,
                libraryPoseId: libraryPose.id,
              };
            }
            return item;
          });
        }

        // add: insert after target key, or at end of warmUp if afterKey null
        const newItem: EditorItem = {
          key: `pose-added-${Date.now()}-${libraryPose.id}`,
          kind: 'pose',
          pose: generated,
          libraryPoseId: libraryPose.id,
        };

        if (!pickerMode.afterKey) {
          // insert at the very end
          return [...prev, newItem];
        }

        const idx = prev.findIndex((item) => item.key === pickerMode.afterKey);
        if (idx === -1) return [...prev, newItem];
        return [...prev.slice(0, idx + 1), newItem, ...prev.slice(idx + 1)];
      });
      setDirty(true);
      setPickerMode(null);
    },
    [pickerMode]
  );

  const handleSave = useCallback(async () => {
    if (!sequence) return;
    try {
      setSaving(true);
      const rebuilt = rebuildSequence(sequence.posesJson, items);
      await updateSequence(db, sequence.id, { posesJson: rebuilt });
      setDirty(false);
      router.back();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Save failed', msg);
      setSaving(false);
    }
  }, [db, items, router, sequence]);

  const handleCancel = useCallback(() => {
    if (!dirty) {
      router.back();
      return;
    }
    Alert.alert(
      'Discard changes?',
      'Your edits will be lost.',
      [
        { text: 'Keep editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  }, [dirty, router]);

  const poseCount = useMemo(
    () => items.filter((i) => i.kind === 'pose').length,
    [items]
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}>
        <Stack.Screen options={{ title: 'Loading…' }} />
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!sequence) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={[styles.notFound, { color: colors.text }]}>
          Class not found
        </Text>
      </View>
    );
  }

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<EditorItem>) => {
    if (item.kind === 'section') {
      return (
        <View style={styles.sectionHeader}>
          <Pressable onLongPress={drag} disabled={isActive}>
            <Text style={[styles.sectionHeaderText, { color: colors.tint }]}>
              {item.label}
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.poseRow,
            {
              backgroundColor: isActive ? colors.cream : colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.dragHandle}>
            <Text style={[styles.dragHandleText, { color: colors.warmGray }]}>
              ⋮⋮
            </Text>
          </View>
          <PoseIllustration poseId={item.libraryPoseId ?? ''} size={44} />
          <View style={styles.poseText}>
            <Text style={[styles.poseName, { color: colors.text }]} numberOfLines={1}>
              {item.pose.englishName}
            </Text>
            <Text
              style={[styles.poseMeta, { color: colors.warmGray }]}
              numberOfLines={1}>
              {item.pose.holdBreaths} breaths
              {item.pose.side !== 'none' ? ` · ${item.pose.side}` : ''}
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => handleSwapRequest(item.key)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}>
              <Text style={[styles.actionText, { color: colors.tint }]}>⇄</Text>
            </Pressable>
            <Pressable
              onPress={() => handleRemove(item.key)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}>
              <Text style={[styles.actionText, { color: colors.error }]}>
                ✕
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Edit Class',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={handleCancel} hitSlop={10}>
              <Text style={[styles.headerAction, { color: colors.tint }]}>
                Cancel
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              disabled={!dirty || saving}
              hitSlop={10}>
              <Text
                style={[
                  styles.headerAction,
                  {
                    color: dirty && !saving ? colors.tint : colors.warmGray,
                    fontWeight: '600',
                  },
                ]}>
                {saving ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={[styles.infoBar, { backgroundColor: colors.surface }]}>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {poseCount} {poseCount === 1 ? 'pose' : 'poses'} · hold to drag
        </Text>
      </View>

      <DraggableFlatList
        data={items}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.listContent}
        activationDistance={8}
      />

      <View style={[styles.footer, { borderColor: colors.border, backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => handleAddRequest(null)}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: colors.tint,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={styles.addButtonText}>+ Add Pose</Text>
        </Pressable>
      </View>

      <PosePickerModal
        visible={pickerMode !== null}
        title={pickerMode?.type === 'swap' ? 'Swap Pose' : 'Add Pose'}
        onPick={handlePickerPick}
        onClose={() => setPickerMode(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 16 },
  headerAction: {
    fontSize: 16,
    paddingHorizontal: 12,
  },
  infoBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  infoText: { fontSize: 12 },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  poseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  dragHandle: {
    width: 20,
    alignItems: 'center',
  },
  dragHandleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  poseText: {
    flex: 1,
  },
  poseName: {
    fontSize: 15,
    fontWeight: '600',
  },
  poseMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
