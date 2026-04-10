import { supabase } from './supabase';
import type { GeneratedSequence, SequenceGenerationParams } from '@/services/types';

/**
 * Cloud repository — Supabase Postgres operations.
 *
 * All operations are scoped to the authenticated user via RLS.
 * Failures are logged but never thrown — callers handle graceful degradation.
 */

// ── Sequences ───────────────────────────────────────────────

export async function cloudSaveSequence(
  id: string,
  sequence: GeneratedSequence,
  params: SequenceGenerationParams,
  customName?: string
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('sequences').upsert({
    id,
    user_id: user.id,
    name: customName || sequence.name,
    style: params.style,
    duration_minutes: params.durationMinutes,
    difficulty: params.difficulty,
    focus_areas: params.focusAreas,
    intention: sequence.intention || params.intention || '',
    poses_json: sequence,
    notes: '',
    tags: [],
  });

  if (error) {
    console.warn('[Cloud] Failed to save sequence:', error.message);
    return false;
  }

  console.log(`[Cloud] Saved sequence ${id}`);
  return true;
}

export async function cloudGetAllSequences(): Promise<CloudSequenceRow[]> {
  const { data, error } = await supabase
    .from('sequences')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[Cloud] Failed to fetch sequences:', error.message);
    return [];
  }

  return (data ?? []) as CloudSequenceRow[];
}

/**
 * Update an existing sequence's poses and metadata.
 * Uses a partial update so we don't clobber fields the editor doesn't touch
 * (style, duration_minutes, difficulty are immutable in the edit flow).
 */
export async function cloudUpdateSequence(
  id: string,
  sequence: GeneratedSequence,
  name?: string
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('sequences')
    .update({
      name: name ?? sequence.name,
      focus_areas: sequence.focusAreas,
      intention: sequence.intention || '',
      poses_json: sequence,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.warn('[Cloud] Failed to update sequence:', error.message);
    return false;
  }

  console.log(`[Cloud] Updated sequence ${id}`);
  return true;
}

export async function cloudDeleteSequence(id: string): Promise<boolean> {
  const { error } = await supabase.from('sequences').delete().eq('id', id);

  if (error) {
    console.warn('[Cloud] Failed to delete sequence:', error.message);
    return false;
  }

  console.log(`[Cloud] Deleted sequence ${id}`);
  return true;
}

// ── Pose Notes ──────────────────────────────────────────────

export async function cloudAddPoseNote(
  poseId: string,
  content: string
): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('pose_notes')
    .insert({ user_id: user.id, pose_id: poseId, content })
    .select('id')
    .single();

  if (error) {
    console.warn('[Cloud] Failed to add pose note:', error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function cloudGetPoseNotes(
  poseId: string
): Promise<CloudNoteRow[]> {
  const { data, error } = await supabase
    .from('pose_notes')
    .select('*')
    .eq('pose_id', poseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[Cloud] Failed to fetch pose notes:', error.message);
    return [];
  }

  return (data ?? []) as CloudNoteRow[];
}

// ── Sequence Notes ──────────────────────────────────────────

export async function cloudAddSequenceNote(
  sequenceId: string,
  content: string
): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('sequence_notes')
    .insert({ user_id: user.id, sequence_id: sequenceId, content })
    .select('id')
    .single();

  if (error) {
    console.warn('[Cloud] Failed to add sequence note:', error.message);
    return null;
  }

  return data?.id ?? null;
}

// ── Shared Note Operations ──────────────────────────────────

export async function cloudUpdateNote(
  table: 'pose_notes' | 'sequence_notes',
  noteId: number,
  content: string
): Promise<boolean> {
  const { error } = await supabase
    .from(table)
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', noteId);

  if (error) {
    console.warn('[Cloud] Failed to update note:', error.message);
    return false;
  }

  return true;
}

export async function cloudDeleteNote(
  table: 'pose_notes' | 'sequence_notes',
  noteId: number
): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq('id', noteId);

  if (error) {
    console.warn('[Cloud] Failed to delete note:', error.message);
    return false;
  }

  return true;
}

// ── Types ───────────────────────────────────────────────────

export interface CloudSequenceRow {
  id: string;
  user_id: string;
  name: string;
  style: string;
  duration_minutes: number;
  difficulty: string;
  focus_areas: string[];
  intention: string;
  poses_json: GeneratedSequence;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CloudNoteRow {
  id: number;
  user_id: string;
  pose_id?: string;
  sequence_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
}
