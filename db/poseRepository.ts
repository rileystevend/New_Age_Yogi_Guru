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
