import { Pose, PoseCategory, Difficulty, BodyFocus } from '@/types/pose';
import { poses } from './poses';

/**
 * Pose data access helpers.
 * These operate on the in-memory seed data. When we move to SQLite (S03),
 * the signatures stay the same but the implementation queries the DB.
 */

console.log(`[PoseData] Loaded ${poses.length} poses`);

/** Get a single pose by its unique ID. */
export function getPoseById(id: string): Pose | undefined {
  return poses.find((p) => p.id === id);
}

/** Get all poses in a given category. */
export function getPosesByCategory(category: PoseCategory): Pose[] {
  return poses.filter((p) => p.category === category);
}

/** Get all poses at a given difficulty level. */
export function getPosesByDifficulty(difficulty: Difficulty): Pose[] {
  return poses.filter((p) => p.difficulty === difficulty);
}

/** Get all poses that target a specific body area. */
export function getPosesByBodyFocus(focus: BodyFocus): Pose[] {
  return poses.filter((p) => p.bodyFocus.includes(focus));
}

/**
 * Search poses by query string.
 * Matches against English name, Sanskrit name, tags, and category.
 * Case-insensitive.
 */
export function searchPoses(query: string): Pose[] {
  const q = query.toLowerCase().trim();
  if (!q) return poses;

  return poses.filter(
    (p) =>
      p.englishName.toLowerCase().includes(q) ||
      p.sanskritName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

/** Total number of poses in the library. */
export function getPoseCount(): number {
  return poses.length;
}

/** Get all unique categories that have at least one pose. */
export function getAvailableCategories(): PoseCategory[] {
  return [...new Set(poses.map((p) => p.category))];
}

/** Get all unique body focus areas that have at least one pose. */
export function getAvailableBodyFocusAreas(): BodyFocus[] {
  return [...new Set(poses.flatMap((p) => p.bodyFocus))];
}
