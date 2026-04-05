import type { SQLiteDatabase } from 'expo-sqlite';
import type { GeneratedSequence, SequenceGenerationParams } from '@/services/types';
import type { Difficulty, BodyFocus } from '@/types/pose';
import { cloudSaveSequence, cloudDeleteSequence } from '@/lib/cloudRepository';

/**
 * Saved sequence as stored in the database.
 */
export interface SavedSequence {
  id: string;
  name: string;
  style: string;
  durationMinutes: number;
  difficulty: string;
  focusAreas: string[];
  intention: string;
  /** Full sequence data serialized as JSON */
  posesJson: GeneratedSequence;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface SequenceRow {
  id: string;
  name: string;
  style: string;
  duration_minutes: number;
  difficulty: string;
  focus_areas: string;
  intention: string;
  poses_json: string;
  notes: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

function rowToSavedSequence(row: SequenceRow): SavedSequence {
  return {
    id: row.id,
    name: row.name,
    style: row.style,
    durationMinutes: row.duration_minutes,
    difficulty: row.difficulty,
    focusAreas: JSON.parse(row.focus_areas),
    intention: row.intention,
    posesJson: JSON.parse(row.poses_json),
    notes: row.notes,
    tags: JSON.parse(row.tags),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Generate a unique ID for a new sequence */
function generateId(): string {
  return `seq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Save a generated sequence to the portfolio.
 * Returns the saved sequence ID.
 */
export async function saveSequence(
  db: SQLiteDatabase,
  sequence: GeneratedSequence,
  params: SequenceGenerationParams,
  customName?: string
): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO sequences (id, name, style, duration_minutes, difficulty, focus_areas, intention, poses_json, notes, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      customName || sequence.name,
      params.style,
      params.durationMinutes,
      params.difficulty,
      JSON.stringify(params.focusAreas),
      sequence.intention || params.intention || '',
      JSON.stringify(sequence),
      '',
      JSON.stringify([]),
      now,
      now,
    ]
  );

  console.log(`[Portfolio] Saved sequence "${customName || sequence.name}" (${id})`);

  // Dual-write to cloud (non-blocking)
  cloudSaveSequence(id, sequence, params, customName).catch(() => {});

  return id;
}

/** Get all saved sequences, newest first. */
export async function getAllSequences(
  db: SQLiteDatabase
): Promise<SavedSequence[]> {
  const rows = await db.getAllAsync<SequenceRow>(
    'SELECT * FROM sequences ORDER BY created_at DESC'
  );
  return rows.map(rowToSavedSequence);
}

/** Get a single saved sequence by ID. */
export async function getSequenceById(
  db: SQLiteDatabase,
  id: string
): Promise<SavedSequence | null> {
  const row = await db.getFirstAsync<SequenceRow>(
    'SELECT * FROM sequences WHERE id = ?',
    [id]
  );
  return row ? rowToSavedSequence(row) : null;
}

/** Delete a saved sequence by ID. */
export async function deleteSequence(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync('DELETE FROM sequences WHERE id = ?', [id]);
  console.log(`[Portfolio] Deleted sequence ${id}`);

  // Dual-delete from cloud (non-blocking)
  cloudDeleteSequence(id).catch(() => {});
}

/** Get the total number of saved sequences. */
export async function getSequenceCount(
  db: SQLiteDatabase
): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sequences'
  );
  return result?.count ?? 0;
}
