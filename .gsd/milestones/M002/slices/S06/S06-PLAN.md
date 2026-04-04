# S06: Sequence Editor + Portfolio Save

**Goal:** Build the sequence editing UI and portfolio save/list/detail screens
**Demo:** After this: User edits an AI-generated sequence (reorder, add, remove poses) and saves it to their portfolio

## Tasks
- [x] **T01: Built sequence repository with CRUD operations and Save to Portfolio button in builder** — 1. Create db/sequenceRepository.ts with CRUD operations for sequences table
2. Implement saveSequence() that converts GeneratedSequence + params into a DB row
3. Implement getAllSequences(), getSequenceById(), deleteSequence()
4. Add a 'Save to Portfolio' button in the builder result phase
5. Prompt user for a name (default to AI-generated name)
6. After save, show success feedback and option to view in portfolio
7. Prevent duplicate saves of the same sequence
  - Estimate: 25min
  - Files: db/sequenceRepository.ts, db/index.ts, app/(tabs)/builder.tsx
  - Verify: Run `npx tsc --noEmit`. Generate a sequence, save it, verify it appears in SQLite.
- [x] **T02: Built portfolio list and sequence detail screens with delete functionality** — 1. Replace portfolio.tsx placeholder with a real list of saved sequences
2. Each list item shows: name, style, duration, difficulty, date saved
3. Tapping a saved sequence opens a detail view with SequenceDisplay
4. Add delete functionality with confirmation
5. Handle empty portfolio with a friendly message and link to builder
6. Create app/sequence/[id].tsx for saved sequence detail
7. Git commit with all S06 changes
  - Estimate: 25min
  - Files: app/(tabs)/portfolio.tsx, app/sequence/[id].tsx, app/sequence/_layout.tsx
  - Verify: Run `npx tsc --noEmit`. Save a sequence from builder, navigate to portfolio, see it listed, tap to view details. Delete and confirm it's removed.
