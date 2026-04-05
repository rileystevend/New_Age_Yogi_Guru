-- Supabase schema for New Age Yogi Guru
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Enable Row Level Security on all tables

-- Sequences table
CREATE TABLE IF NOT EXISTS sequences (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  focus_areas JSONB NOT NULL DEFAULT '[]',
  intention TEXT NOT NULL DEFAULT '',
  poses_json JSONB NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sequences"
  ON sequences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sequences"
  ON sequences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sequences"
  ON sequences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sequences"
  ON sequences FOR DELETE
  USING (auth.uid() = user_id);

-- Pose notes table
CREATE TABLE IF NOT EXISTS pose_notes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pose_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pose_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pose notes"
  ON pose_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pose notes"
  ON pose_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pose notes"
  ON pose_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pose notes"
  ON pose_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Sequence notes table
CREATE TABLE IF NOT EXISTS sequence_notes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE sequence_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sequence notes"
  ON sequence_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sequence notes"
  ON sequence_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sequence notes"
  ON sequence_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sequence notes"
  ON sequence_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sequences_user_id ON sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_pose_notes_user_pose ON pose_notes(user_id, pose_id);
CREATE INDEX IF NOT EXISTS idx_sequence_notes_user_seq ON sequence_notes(user_id, sequence_id);
