import type { Pose } from '@/types/pose';
import type { GeneratedPose } from '@/services/types';

/**
 * Convert a library Pose into the GeneratedPose shape used inside sequences.
 *
 * Sequences were originally populated from Claude output (GeneratedPose) which
 * has no library reference. When a user adds a pose from the library in the
 * editor, we project the library record into the same shape so the rest of the
 * app (display, storage, editor) doesn't need to know the difference.
 */
export function libraryPoseToGeneratedPose(
  pose: Pose,
  opts: { holdBreaths?: number } = {}
): GeneratedPose {
  return {
    englishName: pose.englishName,
    sanskritName: pose.sanskritName,
    holdBreaths: opts.holdBreaths ?? 5,
    side: pose.isBilateral ? 'both' : 'none',
    teachingCues: pose.teachingCues.slice(0, 3),
    transitionNote: '',
  };
}

/**
 * Best-effort match of a generated pose back to a library pose by name.
 * Used so the editor can render a pose illustration for poses Claude produced.
 */
export function findLibraryPoseId(
  generated: Pick<GeneratedPose, 'englishName' | 'sanskritName'>,
  allPoses: Pose[]
): string | null {
  const englishKey = normalizeName(generated.englishName);
  const sanskritKey = normalizeName(generated.sanskritName);

  // Try english name match first
  const byEnglish = allPoses.find(
    (p) => normalizeName(p.englishName) === englishKey
  );
  if (byEnglish) return byEnglish.id;

  // Fall back to sanskrit
  const bySanskrit = allPoses.find(
    (p) => normalizeName(p.sanskritName) === sanskritKey
  );
  if (bySanskrit) return bySanskrit.id;

  return null;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // strip parenthetical aliases
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}
