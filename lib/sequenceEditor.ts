/**
 * Pure transform helpers for the sequence editor.
 *
 * Extracted from app/sequence/[id]/edit.tsx so they can be unit-tested
 * without pulling in react-native.
 */

import type { GeneratedPose, GeneratedSequence } from '@/services/types';

export type SectionKey = 'warmUp' | 'mainSequence' | 'coolDown';

export type EditorItem =
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

export const SECTION_LABELS: Record<SectionKey, string> = {
  warmUp: '🌅 Warm Up',
  mainSequence: '🔥 Main Sequence',
  coolDown: '🌙 Cool Down',
};

const SECTION_ORDER: SectionKey[] = ['warmUp', 'mainSequence', 'coolDown'];

/**
 * Flatten the three sequence buckets into a single ordered list with inline
 * section markers. The editor drives drag-drop against this flat list and
 * rebuilds the buckets on save.
 */
export function flattenSequence(
  seq: GeneratedSequence,
  resolveLibraryId: (pose: GeneratedPose) => string | null = () => null
): EditorItem[] {
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
        libraryPoseId: resolveLibraryId(pose),
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

/**
 * Rebuild a GeneratedSequence from an ordered editor list.
 * Each pose is assigned to whichever section marker precedes it.
 * Poses before any section marker fall into warmUp.
 */
export function rebuildSequence(
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

/**
 * Ensure the three section markers are present, unique, and in order.
 * Used after drag-drop — the drag library can leave markers in arbitrary
 * positions or allow duplicates if the user does something odd.
 *
 * Rules:
 *  - Duplicate section markers are dropped (keeping the first occurrence).
 *  - Missing markers are inserted so all three always exist.
 *  - Markers are forced into warmUp → mainSequence → coolDown order.
 *  - Poses floating before the first marker are reassigned to warmUp
 *    (this is the effective behavior — rebuildSequence's currentSection
 *    default handles it, and normalizeItems guarantees the marker exists).
 */
export function normalizeItems(items: EditorItem[]): EditorItem[] {
  // 1. Drop duplicate section markers.
  const seen = new Set<SectionKey>();
  const deduped: EditorItem[] = [];
  for (const item of items) {
    if (item.kind === 'section') {
      if (seen.has(item.section)) continue;
      seen.add(item.section);
    }
    deduped.push(item);
  }

  // 2. Force markers into the canonical order by splitting into buckets.
  const buckets: Record<SectionKey, EditorItem[]> = {
    warmUp: [],
    mainSequence: [],
    coolDown: [],
  };
  let currentSection: SectionKey = 'warmUp';
  for (const item of deduped) {
    if (item.kind === 'section') {
      currentSection = item.section;
      continue;
    }
    buckets[currentSection].push(item);
  }

  // 3. Rebuild with markers in order, always including all three.
  const result: EditorItem[] = [];
  for (const section of SECTION_ORDER) {
    result.push({
      key: `section-${section}`,
      kind: 'section',
      section,
      label: SECTION_LABELS[section],
    });
    result.push(...buckets[section]);
  }
  return result;
}

/**
 * Insert a new pose item into the editor list after a given key.
 * If afterKey is null, append to the very end.
 */
export function insertAfter(
  items: EditorItem[],
  afterKey: string | null,
  newItem: EditorItem
): EditorItem[] {
  if (!afterKey) {
    return [...items, newItem];
  }
  const idx = items.findIndex((item) => item.key === afterKey);
  if (idx === -1) return [...items, newItem];
  return [...items.slice(0, idx + 1), newItem, ...items.slice(idx + 1)];
}

/**
 * Replace the pose at targetKey with a new pose item.
 * Returns the list unchanged if no match is found.
 */
export function replaceAt(
  items: EditorItem[],
  targetKey: string,
  newItem: EditorItem
): EditorItem[] {
  return items.map((item) => (item.key === targetKey ? newItem : item));
}

/** Remove an item by key. */
export function removeByKey(
  items: EditorItem[],
  key: string
): EditorItem[] {
  return items.filter((item) => item.key !== key);
}
