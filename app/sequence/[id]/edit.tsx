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
import type { GeneratedPose } from '@/services/types';
import type { Pose } from '@/types/pose';
import { PoseIllustration } from '@/components/PoseIllustration';
import { PosePickerModal } from '@/components/PosePickerModal';
import {
  libraryPoseToGeneratedPose,
  findLibraryPoseId,
} from '@/lib/poseConversion';
import {
  flattenSequence,
  rebuildSequence,
  normalizeItems,
  insertAfter,
  replaceAt,
  removeByKey,
  type EditorItem,
} from '@/lib/sequenceEditor';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

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
      setItems(
        flattenSequence(seq.posesJson, (p) => findLibraryPoseId(p, library))
      );
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
    setItems((prev) => removeByKey(prev, key));
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
          const replacement: EditorItem = {
            key: `pose-swap-${Date.now()}-${libraryPose.id}`,
            kind: 'pose',
            pose: generated,
            libraryPoseId: libraryPose.id,
          };
          return replaceAt(prev, pickerMode.targetKey, replacement);
        }

        const newItem: EditorItem = {
          key: `pose-added-${Date.now()}-${libraryPose.id}`,
          kind: 'pose',
          pose: generated,
          libraryPoseId: libraryPose.id,
        };
        return insertAfter(prev, pickerMode.afterKey, newItem);
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
