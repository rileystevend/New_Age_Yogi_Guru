import type { SQLiteDatabase } from 'expo-sqlite';
import {
  cloudAddPoseNote,
  cloudAddSequenceNote,
  cloudUpdateNote,
  cloudDeleteNote,
} from '@/lib/cloudRepository';

export interface Note {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteRow {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Pose Notes ──────────────────────────────────────────────

export async function getNotesForPose(
  db: SQLiteDatabase,
  poseId: string
): Promise<Note[]> {
  const rows = await db.getAllAsync<NoteRow>(
    'SELECT id, content, created_at, updated_at FROM pose_notes WHERE pose_id = ? ORDER BY created_at DESC',
    [poseId]
  );
  return rows.map(rowToNote);
}

export async function addNoteForPose(
  db: SQLiteDatabase,
  poseId: string,
  content: string
): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO pose_notes (pose_id, content) VALUES (?, ?)',
    [poseId, content]
  );
  console.log(`[Notes] Added pose note for ${poseId} (id: ${result.lastInsertRowId})`);

  // Dual-write to cloud (non-blocking)
  cloudAddPoseNote(poseId, content).catch(() => {});

  return result.lastInsertRowId;
}

// ── Sequence Notes ──────────────────────────────────────────

export async function getNotesForSequence(
  db: SQLiteDatabase,
  sequenceId: string
): Promise<Note[]> {
  const rows = await db.getAllAsync<NoteRow>(
    'SELECT id, content, created_at, updated_at FROM sequence_notes WHERE sequence_id = ? ORDER BY created_at DESC',
    [sequenceId]
  );
  return rows.map(rowToNote);
}

export async function addNoteForSequence(
  db: SQLiteDatabase,
  sequenceId: string,
  content: string
): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO sequence_notes (sequence_id, content) VALUES (?, ?)',
    [sequenceId, content]
  );
  console.log(`[Notes] Added sequence note for ${sequenceId} (id: ${result.lastInsertRowId})`);

  // Dual-write to cloud (non-blocking)
  cloudAddSequenceNote(sequenceId, content).catch(() => {});

  return result.lastInsertRowId;
}

// ── Shared ──────────────────────────────────────────────────

export async function updateNote(
  db: SQLiteDatabase,
  table: 'pose_notes' | 'sequence_notes',
  noteId: number,
  content: string
): Promise<void> {
  await db.runAsync(
    `UPDATE ${table} SET content = ?, updated_at = datetime('now') WHERE id = ?`,
    [content, noteId]
  );

  // Dual-write to cloud (non-blocking)
  cloudUpdateNote(table, noteId, content).catch(() => {});
}

export async function deleteNote(
  db: SQLiteDatabase,
  table: 'pose_notes' | 'sequence_notes',
  noteId: number
): Promise<void> {
  await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [noteId]);
  console.log(`[Notes] Deleted note ${noteId} from ${table}`);

  // Dual-delete from cloud (non-blocking)
  cloudDeleteNote(table, noteId).catch(() => {});
}
