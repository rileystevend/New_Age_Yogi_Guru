import {
  libraryPoseToGeneratedPose,
  findLibraryPoseId,
} from '@/lib/poseConversion';
import type { Pose } from '@/types/pose';

function makeLibraryPose(overrides: Partial<Pose> = {}): Pose {
  return {
    id: 'warrior-i',
    englishName: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    category: 'standing',
    difficulty: 'beginner',
    bodyFocus: ['legs', 'hips'],
    description: 'A powerful standing pose',
    teachingCues: ['cue 1', 'cue 2', 'cue 3', 'cue 4', 'cue 5'],
    contraindications: [],
    imageUrl: null,
    tags: [],
    drishti: 'forward',
    breathCue: 'inhale',
    isBilateral: true,
    ...overrides,
  };
}

// ── libraryPoseToGeneratedPose ──────────────────────────────────────

describe('libraryPoseToGeneratedPose', () => {
  it('copies english and sanskrit names', () => {
    const pose = makeLibraryPose();
    const generated = libraryPoseToGeneratedPose(pose);
    expect(generated.englishName).toBe('Warrior I');
    expect(generated.sanskritName).toBe('Virabhadrasana I');
  });

  it('defaults holdBreaths to 5', () => {
    const generated = libraryPoseToGeneratedPose(makeLibraryPose());
    expect(generated.holdBreaths).toBe(5);
  });

  it('respects a custom holdBreaths override', () => {
    const generated = libraryPoseToGeneratedPose(makeLibraryPose(), {
      holdBreaths: 8,
    });
    expect(generated.holdBreaths).toBe(8);
  });

  it('sets side to "both" for bilateral poses', () => {
    const generated = libraryPoseToGeneratedPose(
      makeLibraryPose({ isBilateral: true })
    );
    expect(generated.side).toBe('both');
  });

  it('sets side to "none" for non-bilateral poses', () => {
    const generated = libraryPoseToGeneratedPose(
      makeLibraryPose({ isBilateral: false })
    );
    expect(generated.side).toBe('none');
  });

  it('truncates teaching cues to the first 3', () => {
    const generated = libraryPoseToGeneratedPose(
      makeLibraryPose({
        teachingCues: ['one', 'two', 'three', 'four', 'five'],
      })
    );
    expect(generated.teachingCues).toEqual(['one', 'two', 'three']);
  });

  it('handles fewer than 3 teaching cues without padding', () => {
    const generated = libraryPoseToGeneratedPose(
      makeLibraryPose({ teachingCues: ['only one'] })
    );
    expect(generated.teachingCues).toEqual(['only one']);
  });

  it('emits an empty transitionNote (editor can fill this in later)', () => {
    const generated = libraryPoseToGeneratedPose(makeLibraryPose());
    expect(generated.transitionNote).toBe('');
  });
});

// ── findLibraryPoseId ───────────────────────────────────────────────

describe('findLibraryPoseId', () => {
  const library: Pose[] = [
    makeLibraryPose({
      id: 'warrior-i',
      englishName: 'Warrior I',
      sanskritName: 'Virabhadrasana I',
    }),
    makeLibraryPose({
      id: 'mountain-pose',
      englishName: 'Mountain Pose',
      sanskritName: 'Tadasana',
    }),
    makeLibraryPose({
      id: 'downward-dog',
      englishName: 'Downward-Facing Dog',
      sanskritName: 'Adho Mukha Svanasana',
    }),
  ];

  it('finds an exact english-name match', () => {
    const id = findLibraryPoseId(
      { englishName: 'Warrior I', sanskritName: 'Virabhadrasana I' },
      library
    );
    expect(id).toBe('warrior-i');
  });

  it('is case-insensitive', () => {
    const id = findLibraryPoseId(
      { englishName: 'warrior i', sanskritName: 'whatever' },
      library
    );
    expect(id).toBe('warrior-i');
  });

  it('ignores punctuation and spacing differences', () => {
    // Claude may emit "Downward Dog" without the hyphen
    const id = findLibraryPoseId(
      { englishName: 'Downward Dog', sanskritName: 'Adho Mukha Svanasana' },
      library
    );
    // Both english fuzzy match AND sanskrit exact match — either is fine
    expect(id).toBeTruthy();
  });

  it('falls back to sanskrit name when english name does not match', () => {
    const id = findLibraryPoseId(
      { englishName: 'Totally Made Up Pose', sanskritName: 'Tadasana' },
      library
    );
    expect(id).toBe('mountain-pose');
  });

  it('strips parenthetical aliases from names', () => {
    // Some sequences include aliases like "Warrior I (high lunge variation)"
    const id = findLibraryPoseId(
      { englishName: 'Warrior I (variation)', sanskritName: 'whatever' },
      library
    );
    expect(id).toBe('warrior-i');
  });

  it('returns null when no match is found', () => {
    const id = findLibraryPoseId(
      { englishName: 'Not A Real Pose', sanskritName: 'Nonsense' },
      library
    );
    expect(id).toBeNull();
  });

  it('returns null against an empty library', () => {
    const id = findLibraryPoseId(
      { englishName: 'Warrior I', sanskritName: 'Virabhadrasana I' },
      []
    );
    expect(id).toBeNull();
  });
});
