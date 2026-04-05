---
estimated_steps: 9
estimated_files: 4
skills_used: []
---

# T01: Supabase Tables + Cloud Repository + Dual-Write from Builder

1. Create Supabase tables via SQL migration (in README): sequences, sequence_notes, pose_notes with user_id foreign key and RLS
2. Create lib/cloudRepository.ts with Supabase CRUD for sequences and notes
3. Update saveSequence in db/sequenceRepository.ts to dual-write: save to local SQLite AND Supabase if authenticated
4. Update getAllSequences to merge local + cloud data (prefer cloud if available)
5. Update deleteSequence to delete from both
6. Same pattern for notes: addNote saves to both, getAll merges
7. Handle offline gracefully: if Supabase call fails, log warning but don't block the local save
8. Add Supabase SQL migration script to docs/supabase-schema.sql
9. Git commit

## Inputs

- `lib/supabase.ts — Supabase client from S10`
- `context/AuthContext.tsx — auth state from S10`
- `db/sequenceRepository.ts — existing local CRUD`

## Expected Output

- `lib/cloudRepository.ts — Supabase CRUD for sequences and notes`
- `docs/supabase-schema.sql — Supabase table creation SQL`

## Verification

Run `npx tsc --noEmit`. Save a sequence while authenticated — verify it appears in Supabase dashboard. Git commit clean.
