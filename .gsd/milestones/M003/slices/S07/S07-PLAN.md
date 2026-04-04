# S07: Notes System — Pose & Sequence Annotations

**Goal:** Build CRUD notes interface attached to poses and sequences with local persistence
**Demo:** After this: User adds notes to a pose and to a saved sequence, notes persist and display on revisit

## Tasks
- [x] **T01: Built notes system with CRUD repository, reusable NotesSection component, and integration into pose and sequence detail screens** — 1. Create db/notesRepository.ts with CRUD for pose_notes and sequence_notes tables
2. Implement getNotesForPose(), addNoteForPose(), updateNote(), deleteNote()
3. Implement getNotesForSequence(), addNoteForSequence()
4. Create a reusable NotesSection component that displays notes with add/edit/delete
5. Integrate NotesSection into app/pose/[id].tsx
6. Integrate NotesSection into app/sequence/[id].tsx
7. Notes input with save button, edit inline, swipe-to-delete or tap-to-delete
8. Git commit
  - Estimate: 35min
  - Files: db/notesRepository.ts, db/index.ts, components/NotesSection.tsx, app/pose/[id].tsx, app/sequence/[id].tsx
  - Verify: Run `npx tsc --noEmit`. Add a note to a pose, close and reopen — note persists. Add a note to a sequence, same test. Delete a note — gone. Git commit clean.
