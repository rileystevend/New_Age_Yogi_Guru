import type { SQLiteDatabase } from 'expo-sqlite';
import type { Pose, PoseCategory, Difficulty, BodyFocus } from '@/types/pose';

/**
 * Pose repository — SQLite-backed queries.
 *
 * These functions mirror the signatures in data/poseHelpers.ts
 * but read from the database instead of in-memory arrays.
 */

interface PoseRow {
  id: string;
  english_name: string;
  sanskrit_name: string;
  category: string;
  difficulty: string;
  body_focus: string;
  description: string;
  teaching_cues: string;
  contraindications: string;
  image_url: string | null;
  tags: string;
  drishti: string;
  breath_cue: string;
  is_bilateral: number;
}

/** Convert a database row to a typed Pose object */
function rowToPose(row: PoseRow): Pose {
  return {
    id: row.id,
    englishName: row.english_name,
    sanskritName: row.sanskrit_name,
    category: row.category as PoseCategory,
    difficulty: row.difficulty as Difficulty,
    bodyFocus: JSON.parse(row.body_focus) as BodyFocus[],
    description: row.description,
    teachingCues: JSON.parse(row.teaching_cues) as string[],
    contraindications: JSON.parse(row.contraindications) as string[],
    imageUrl: row.image_url,
    tags: JSON.parse(row.tags) as string[],
    drishti: row.drishti,
    breathCue: row.breath_cue,
    isBilateral: row.is_bilateral === 1,
  };
}

export async function getAllPoses(db: SQLiteDatabase): Promise<Pose[]> {
  const rows = await db.getAllAsync<PoseRow>('SELECT * FROM poses ORDER BY english_name');
  return rows.map(rowToPose);
}

export async function getPoseById(
  db: SQLiteDatabase,
  id: string
): Promise<Pose | null> {
  const row = await db.getFirstAsync<PoseRow>(
    'SELECT * FROM poses WHERE id = ?',
    [id]
  );
  return row ? rowToPose(row) : null;
}

export async function getPosesByCategory(
  db: SQLiteDatabase,
  category: PoseCategory
): Promise<Pose[]> {
  const rows = await db.getAllAsync<PoseRow>(
    'SELECT * FROM poses WHERE category = ? ORDER BY english_name',
    [category]
  );
  return rows.map(rowToPose);
}

export async function getPosesByDifficulty(
  db: SQLiteDatabase,
  difficulty: Difficulty
): Promise<Pose[]> {
  const rows = await db.getAllAsync<PoseRow>(
    'SELECT * FROM poses WHERE difficulty = ? ORDER BY english_name',
    [difficulty]
  );
  return rows.map(rowToPose);
}

export async function searchPoses(
  db: SQLiteDatabase,
  query: string
): Promise<Pose[]> {
  const q = query.trim();
  if (!q) return getAllPoses(db);

  const pattern = `%${q}%`;
  const rows = await db.getAllAsync<PoseRow>(
    `SELECT * FROM poses
     WHERE english_name LIKE ? OR sanskrit_name LIKE ? OR tags LIKE ? OR category LIKE ?
     ORDER BY english_name`,
    [pattern, pattern, pattern, pattern]
  );
  return rows.map(rowToPose);
}

export async function getPoseCount(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM poses'
  );
  return result?.count ?? 0;
}

export async function getAvailableCategories(
  db: SQLiteDatabase
): Promise<PoseCategory[]> {
  const rows = await db.getAllAsync<{ category: string }>(
    'SELECT DISTINCT category FROM poses ORDER BY category'
  );
  return rows.map((r) => r.category as PoseCategory);
}

/** Generate a slug-style ID from an english name, e.g. "My Custom Pose" → "my-custom-pose" */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Check if a pose ID already exists.
 */
export async function poseIdExists(
  db: SQLiteDatabase,
  id: string
): Promise<boolean> {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM poses WHERE id = ?',
    [id]
  );
  return (row?.count ?? 0) > 0;
}

/**
 * Add a user-created custom pose to the library.
 * Returns the generated pose ID.
 */
export async function addCustomPose(
  db: SQLiteDatabase,
  pose: Omit<Pose, 'id' | 'imageUrl'>
): Promise<string> {
  // Generate a unique ID from the english name
  let id = `custom-${slugify(pose.englishName)}`;
  if (await poseIdExists(db, id)) {
    id = `${id}-${Date.now().toString(36)}`;
  }

  await db.runAsync(
    `INSERT INTO poses (id, english_name, sanskrit_name, category, difficulty, body_focus, description, teaching_cues, contraindications, image_url, tags, drishti, breath_cue, is_bilateral)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      pose.englishName,
      pose.sanskritName,
      pose.category,
      pose.difficulty,
      JSON.stringify(pose.bodyFocus),
      pose.description,
      JSON.stringify(pose.teachingCues),
      JSON.stringify(pose.contraindications),
      null,
      JSON.stringify(pose.tags),
      pose.drishti,
      pose.breathCue,
      pose.isBilateral ? 1 : 0,
    ]
  );

  console.log(`[Poses] Added custom pose "${pose.englishName}" (${id})`);
  return id;
}

/**
 * Update an existing pose (typically a custom one).
 */
export async function updatePose(
  db: SQLiteDatabase,
  id: string,
  updates: Partial<Omit<Pose, 'id' | 'imageUrl'>>
): Promise<void> {
  const existing = await getPoseById(db, id);
  if (!existing) throw new Error(`Pose ${id} not found`);

  const merged = { ...existing, ...updates };

  await db.runAsync(
    `UPDATE poses SET
       english_name = ?,
       sanskrit_name = ?,
       category = ?,
       difficulty = ?,
       body_focus = ?,
       description = ?,
       teaching_cues = ?,
       contraindications = ?,
       tags = ?,
       drishti = ?,
       breath_cue = ?,
       is_bilateral = ?
     WHERE id = ?`,
    [
      merged.englishName,
      merged.sanskritName,
      merged.category,
      merged.difficulty,
      JSON.stringify(merged.bodyFocus),
      merged.description,
      JSON.stringify(merged.teachingCues),
      JSON.stringify(merged.contraindications),
      JSON.stringify(merged.tags),
      merged.drishti,
      merged.breathCue,
      merged.isBilateral ? 1 : 0,
      id,
    ]
  );

  console.log(`[Poses] Updated pose "${merged.englishName}" (${id})`);
}

/**
 * Delete a pose by ID.
 * Also cleans up any notes attached to the pose.
 */
export async function deletePose(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync('DELETE FROM pose_notes WHERE pose_id = ?', [id]);
  await db.runAsync('DELETE FROM poses WHERE id = ?', [id]);
  console.log(`[Poses] Deleted pose ${id}`);
}

/**
 * Check if a pose is a user-created custom pose (IDs start with "custom-").
 */
export function isCustomPose(poseId: string): boolean {
  return poseId.startsWith('custom-');
}
