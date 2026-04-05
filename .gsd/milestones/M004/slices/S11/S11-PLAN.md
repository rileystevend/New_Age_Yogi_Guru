# S11: Cloud Sync — Sequences & Notes to Supabase

**Goal:** Sync sequences and notes to Supabase Postgres so data persists across devices for authenticated users
**Demo:** After this: User saves a class, data syncs to Supabase Postgres. Sign in on another device, classes appear.

## Tasks
- [x] **T01: Implemented dual-write cloud sync — sequences and notes saved to both local SQLite and Supabase Postgres** — 1. Create Supabase tables via SQL migration (in README): sequences, sequence_notes, pose_notes with user_id foreign key and RLS
2. Create lib/cloudRepository.ts with Supabase CRUD for sequences and notes
3. Update saveSequence in db/sequenceRepository.ts to dual-write: save to local SQLite AND Supabase if authenticated
4. Update getAllSequences to merge local + cloud data (prefer cloud if available)
5. Update deleteSequence to delete from both
6. Same pattern for notes: addNote saves to both, getAll merges
7. Handle offline gracefully: if Supabase call fails, log warning but don't block the local save
8. Add Supabase SQL migration script to docs/supabase-schema.sql
9. Git commit
  - Estimate: 40min
  - Files: lib/cloudRepository.ts, db/sequenceRepository.ts, db/notesRepository.ts, docs/supabase-schema.sql
  - Verify: Run `npx tsc --noEmit`. Save a sequence while authenticated — verify it appears in Supabase dashboard. Git commit clean.
