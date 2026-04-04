---
estimated_steps: 8
estimated_files: 5
skills_used: []
---

# T01: Notes Repository + Integration into Pose and Sequence Detail Screens

1. Create db/notesRepository.ts with CRUD for pose_notes and sequence_notes tables
2. Implement getNotesForPose(), addNoteForPose(), updateNote(), deleteNote()
3. Implement getNotesForSequence(), addNoteForSequence()
4. Create a reusable NotesSection component that displays notes with add/edit/delete
5. Integrate NotesSection into app/pose/[id].tsx
6. Integrate NotesSection into app/sequence/[id].tsx
7. Notes input with save button, edit inline, swipe-to-delete or tap-to-delete
8. Git commit

## Inputs

- `db/database.ts — pose_notes and sequence_notes tables from S03`
- `app/pose/[id].tsx — pose detail screen`
- `app/sequence/[id].tsx — sequence detail screen`

## Expected Output

- `db/notesRepository.ts — Notes CRUD operations`
- `components/NotesSection.tsx — Reusable notes UI component`
- `app/pose/[id].tsx — Updated with NotesSection`
- `app/sequence/[id].tsx — Updated with NotesSection`

## Verification

Run `npx tsc --noEmit`. Add a note to a pose, close and reopen — note persists. Add a note to a sequence, same test. Delete a note — gone. Git commit clean.
