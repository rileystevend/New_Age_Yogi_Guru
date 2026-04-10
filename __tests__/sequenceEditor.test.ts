import {
  flattenSequence,
  rebuildSequence,
  normalizeItems,
  insertAfter,
  replaceAt,
  removeByKey,
  SECTION_LABELS,
  type EditorItem,
} from '@/lib/sequenceEditor';
import type { GeneratedPose, GeneratedSequence } from '@/services/types';

// ── Fixtures ────────────────────────────────────────────────────────

function makePose(name: string): GeneratedPose {
  return {
    englishName: name,
    sanskritName: `${name} Sanskrit`,
    holdBreaths: 5,
    side: 'none',
    teachingCues: [`${name} cue 1`, `${name} cue 2`],
    transitionNote: '',
  };
}

function makeSequence(
  warmUp: string[],
  main: string[],
  coolDown: string[]
): GeneratedSequence {
  return {
    name: 'Test Class',
    style: 'vinyasa',
    durationMinutes: 60,
    difficulty: 'intermediate',
    focusAreas: ['hips'],
    intention: 'test intention',
    warmUp: warmUp.map(makePose),
    mainSequence: main.map(makePose),
    coolDown: coolDown.map(makePose),
    closingNotes: '',
  };
}

function poseItem(name: string, key?: string): EditorItem {
  return {
    key: key ?? `pose-${name}`,
    kind: 'pose',
    pose: makePose(name),
    libraryPoseId: null,
  };
}

function sectionItem(section: 'warmUp' | 'mainSequence' | 'coolDown'): EditorItem {
  return {
    key: `section-${section}`,
    kind: 'section',
    section,
    label: SECTION_LABELS[section],
  };
}

// ── flattenSequence ─────────────────────────────────────────────────

describe('flattenSequence', () => {
  it('produces section markers + poses in the canonical order', () => {
    const seq = makeSequence(['A'], ['B', 'C'], ['D']);
    const items = flattenSequence(seq);

    expect(items.map((i) => (i.kind === 'section' ? `[${i.section}]` : i.pose.englishName))).toEqual([
      '[warmUp]',
      'A',
      '[mainSequence]',
      'B',
      'C',
      '[coolDown]',
      'D',
    ]);
  });

  it('includes section markers even for empty sections', () => {
    const seq = makeSequence([], [], []);
    const items = flattenSequence(seq);
    const sections = items.filter((i) => i.kind === 'section');
    expect(sections.map((s) => s.kind === 'section' && s.section)).toEqual([
      'warmUp',
      'mainSequence',
      'coolDown',
    ]);
    expect(items.filter((i) => i.kind === 'pose')).toHaveLength(0);
  });

  it('uses the library resolver to attach libraryPoseId', () => {
    const seq = makeSequence(['A'], ['B'], []);
    const resolver = jest.fn((p: GeneratedPose) =>
      p.englishName === 'A' ? 'lib-a' : null
    );
    const items = flattenSequence(seq, resolver);
    const poseItems = items.filter((i): i is EditorItem & { kind: 'pose' } => i.kind === 'pose');

    expect(poseItems[0].libraryPoseId).toBe('lib-a');
    expect(poseItems[1].libraryPoseId).toBeNull();
    expect(resolver).toHaveBeenCalledTimes(2);
  });

  it('produces unique keys for every pose item', () => {
    // Poses with duplicate names (which Claude can emit) must still get
    // unique keys — otherwise React key collisions corrupt the editor.
    const seq = makeSequence(['Downward Dog'], ['Downward Dog', 'Downward Dog'], []);
    const items = flattenSequence(seq);
    const keys = items.map((i) => i.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

// ── rebuildSequence ─────────────────────────────────────────────────

describe('rebuildSequence', () => {
  it('rebuilds the three buckets from the flat list order', () => {
    const original = makeSequence(['A'], ['B'], ['C']);
    const items: EditorItem[] = [
      sectionItem('warmUp'),
      poseItem('A'),
      sectionItem('mainSequence'),
      poseItem('B'),
      sectionItem('coolDown'),
      poseItem('C'),
    ];
    const rebuilt = rebuildSequence(original, items);

    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['A']);
    expect(rebuilt.mainSequence.map((p) => p.englishName)).toEqual(['B']);
    expect(rebuilt.coolDown.map((p) => p.englishName)).toEqual(['C']);
  });

  it('assigns poses to whichever section marker precedes them', () => {
    // Simulate a cross-section drag: pose "B" moved from mainSequence to coolDown.
    const original = makeSequence(['A'], ['B'], ['C']);
    const items: EditorItem[] = [
      sectionItem('warmUp'),
      poseItem('A'),
      sectionItem('mainSequence'),
      sectionItem('coolDown'),
      poseItem('B'), // now under coolDown because the main marker has nothing after it
      poseItem('C'),
    ];
    const rebuilt = rebuildSequence(original, items);

    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['A']);
    expect(rebuilt.mainSequence.map((p) => p.englishName)).toEqual([]);
    expect(rebuilt.coolDown.map((p) => p.englishName)).toEqual(['B', 'C']);
  });

  it('treats poses before any section marker as warmUp', () => {
    const original = makeSequence([], [], []);
    const items: EditorItem[] = [
      poseItem('Rogue'),
      sectionItem('warmUp'),
      sectionItem('mainSequence'),
      sectionItem('coolDown'),
    ];
    const rebuilt = rebuildSequence(original, items);
    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['Rogue']);
    expect(rebuilt.mainSequence).toEqual([]);
    expect(rebuilt.coolDown).toEqual([]);
  });

  it('preserves non-bucket metadata from the original sequence', () => {
    const original = makeSequence(['A'], ['B'], ['C']);
    original.intention = 'hip opening';
    original.name = 'Morning Flow';

    const rebuilt = rebuildSequence(original, flattenSequence(original));
    expect(rebuilt.name).toBe('Morning Flow');
    expect(rebuilt.intention).toBe('hip opening');
    expect(rebuilt.style).toBe(original.style);
    expect(rebuilt.durationMinutes).toBe(original.durationMinutes);
  });

  it('round-trips through flatten → rebuild with no changes', () => {
    const seq = makeSequence(['A', 'B'], ['C', 'D', 'E'], ['F']);
    const rebuilt = rebuildSequence(seq, flattenSequence(seq));

    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['A', 'B']);
    expect(rebuilt.mainSequence.map((p) => p.englishName)).toEqual(['C', 'D', 'E']);
    expect(rebuilt.coolDown.map((p) => p.englishName)).toEqual(['F']);
  });
});

// ── normalizeItems ──────────────────────────────────────────────────

describe('normalizeItems', () => {
  it('passes through a canonical list unchanged (by shape)', () => {
    const items = flattenSequence(makeSequence(['A'], ['B'], ['C']));
    const normalized = normalizeItems(items);
    expect(normalized).toHaveLength(items.length);
    // Still three section markers, same order
    const sections = normalized.filter((i) => i.kind === 'section');
    expect(sections.map((s) => s.kind === 'section' && s.section)).toEqual([
      'warmUp',
      'mainSequence',
      'coolDown',
    ]);
  });

  it('reinserts missing section markers', () => {
    // User somehow ends up with no cooldown marker
    const items: EditorItem[] = [
      sectionItem('warmUp'),
      poseItem('A'),
      sectionItem('mainSequence'),
      poseItem('B'),
    ];
    const normalized = normalizeItems(items);
    const sections = normalized.filter((i) => i.kind === 'section');
    expect(sections.map((s) => s.kind === 'section' && s.section)).toEqual([
      'warmUp',
      'mainSequence',
      'coolDown',
    ]);
  });

  it('drops duplicate section markers', () => {
    const items: EditorItem[] = [
      sectionItem('warmUp'),
      sectionItem('warmUp'), // duplicate
      poseItem('A'),
      sectionItem('mainSequence'),
      sectionItem('coolDown'),
    ];
    const normalized = normalizeItems(items);
    const warmUpCount = normalized.filter(
      (i) => i.kind === 'section' && i.section === 'warmUp'
    ).length;
    expect(warmUpCount).toBe(1);
  });

  it('forces canonical section order even if markers arrive out of order', () => {
    const items: EditorItem[] = [
      sectionItem('coolDown'),
      poseItem('A'),
      sectionItem('warmUp'),
      poseItem('B'),
      sectionItem('mainSequence'),
      poseItem('C'),
    ];
    const normalized = normalizeItems(items);
    const order = normalized
      .filter((i) => i.kind === 'section')
      .map((s) => (s.kind === 'section' ? s.section : null));
    expect(order).toEqual(['warmUp', 'mainSequence', 'coolDown']);
  });

  it('keeps poses attached to their section after reordering markers', () => {
    // User drags the coolDown marker to the top. Pose A was under coolDown,
    // pose B was under warmUp, pose C was under mainSequence. Each pose
    // should still belong to the section that owned it.
    const items: EditorItem[] = [
      sectionItem('coolDown'),
      poseItem('A'),
      sectionItem('warmUp'),
      poseItem('B'),
      sectionItem('mainSequence'),
      poseItem('C'),
    ];
    const normalized = normalizeItems(items);

    // Rebuild to verify the buckets land correctly
    const rebuilt = rebuildSequence(makeSequence([], [], []), normalized);
    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['B']);
    expect(rebuilt.mainSequence.map((p) => p.englishName)).toEqual(['C']);
    expect(rebuilt.coolDown.map((p) => p.englishName)).toEqual(['A']);
  });

  it('handles a completely empty list by producing all three section markers', () => {
    const normalized = normalizeItems([]);
    expect(normalized).toHaveLength(3);
    expect(normalized.every((i) => i.kind === 'section')).toBe(true);
  });

  it('handles only-poses input by placing them all under warmUp', () => {
    const items: EditorItem[] = [poseItem('A'), poseItem('B')];
    const normalized = normalizeItems(items);
    const rebuilt = rebuildSequence(makeSequence([], [], []), normalized);
    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['A', 'B']);
    expect(rebuilt.mainSequence).toEqual([]);
    expect(rebuilt.coolDown).toEqual([]);
  });
});

// ── insertAfter ─────────────────────────────────────────────────────

describe('insertAfter', () => {
  const base: EditorItem[] = [
    sectionItem('warmUp'),
    poseItem('A', 'a'),
    poseItem('B', 'b'),
  ];

  it('inserts after the matching key', () => {
    const result = insertAfter(base, 'a', poseItem('X', 'x'));
    expect(result.map((i) => i.key)).toEqual([
      'section-warmUp',
      'a',
      'x',
      'b',
    ]);
  });

  it('appends when afterKey is null', () => {
    const result = insertAfter(base, null, poseItem('X', 'x'));
    expect(result[result.length - 1].key).toBe('x');
  });

  it('appends when afterKey does not exist', () => {
    const result = insertAfter(base, 'missing', poseItem('X', 'x'));
    expect(result[result.length - 1].key).toBe('x');
  });

  it('does not mutate the input array', () => {
    const snapshot = [...base];
    insertAfter(base, 'a', poseItem('X', 'x'));
    expect(base).toEqual(snapshot);
  });
});

// ── replaceAt ───────────────────────────────────────────────────────

describe('replaceAt', () => {
  it('replaces only the matching item', () => {
    const base: EditorItem[] = [poseItem('A', 'a'), poseItem('B', 'b')];
    const result = replaceAt(base, 'a', poseItem('X', 'x'));
    expect(result.map((i) => i.key)).toEqual(['x', 'b']);
  });

  it('is a no-op when key is not found', () => {
    const base: EditorItem[] = [poseItem('A', 'a')];
    const result = replaceAt(base, 'missing', poseItem('X', 'x'));
    expect(result).toEqual(base);
  });
});

// ── removeByKey ─────────────────────────────────────────────────────

describe('removeByKey', () => {
  it('removes the matching item', () => {
    const base: EditorItem[] = [
      sectionItem('warmUp'),
      poseItem('A', 'a'),
      poseItem('B', 'b'),
    ];
    const result = removeByKey(base, 'a');
    expect(result.map((i) => i.key)).toEqual(['section-warmUp', 'b']);
  });

  it('is a no-op when key is not found', () => {
    const base: EditorItem[] = [poseItem('A', 'a')];
    expect(removeByKey(base, 'missing')).toEqual(base);
  });
});

// ── end-to-end edit scenarios ───────────────────────────────────────

describe('end-to-end editor flows', () => {
  it('simulates: add a pose, remove another, reorder, and save', () => {
    const seq = makeSequence(
      ['Mountain Pose'],
      ['Warrior I', 'Warrior II'],
      ['Corpse Pose']
    );

    let items = flattenSequence(seq);

    // 1. Add "Downward Dog" after Warrior I
    const warrior1Key = items.find(
      (i) => i.kind === 'pose' && i.pose.englishName === 'Warrior I'
    )!.key;
    items = insertAfter(items, warrior1Key, poseItem('Downward Dog', 'dd'));

    // 2. Remove Warrior II
    const warrior2Key = items.find(
      (i) => i.kind === 'pose' && i.pose.englishName === 'Warrior II'
    )!.key;
    items = removeByKey(items, warrior2Key);

    // 3. Normalize (simulating a drag) and rebuild
    items = normalizeItems(items);
    const rebuilt = rebuildSequence(seq, items);

    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['Mountain Pose']);
    expect(rebuilt.mainSequence.map((p) => p.englishName)).toEqual([
      'Warrior I',
      'Downward Dog',
    ]);
    expect(rebuilt.coolDown.map((p) => p.englishName)).toEqual(['Corpse Pose']);
  });

  it('simulates: swap a pose', () => {
    const seq = makeSequence([], ['Warrior I'], []);
    let items = flattenSequence(seq);

    const targetKey = items.find(
      (i) => i.kind === 'pose' && i.pose.englishName === 'Warrior I'
    )!.key;

    const replacement: EditorItem = {
      key: 'swap-target',
      kind: 'pose',
      pose: makePose('Warrior III'),
      libraryPoseId: 'warrior-iii',
    };
    items = replaceAt(items, targetKey, replacement);

    const rebuilt = rebuildSequence(seq, items);
    expect(rebuilt.mainSequence).toHaveLength(1);
    expect(rebuilt.mainSequence[0].englishName).toBe('Warrior III');
    expect(rebuilt.warmUp).toEqual([]);
    expect(rebuilt.coolDown).toEqual([]);
  });

  it('simulates: drag a pose from main into cooldown', () => {
    const seq = makeSequence(['A'], ['B', 'C'], ['D']);
    let items = flattenSequence(seq);

    // Find pose C and move it to the very end (past coolDown marker)
    const cIdx = items.findIndex(
      (i) => i.kind === 'pose' && i.pose.englishName === 'C'
    );
    const [cItem] = items.splice(cIdx, 1);
    items.push(cItem);

    items = normalizeItems(items);
    const rebuilt = rebuildSequence(seq, items);

    expect(rebuilt.warmUp.map((p) => p.englishName)).toEqual(['A']);
    expect(rebuilt.mainSequence.map((p) => p.englishName)).toEqual(['B']);
    expect(rebuilt.coolDown.map((p) => p.englishName)).toEqual(['D', 'C']);
  });
});
