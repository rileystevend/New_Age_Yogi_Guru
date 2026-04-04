---
estimated_steps: 7
estimated_files: 3
skills_used: []
---

# T01: Sequence Repository + Save Flow from Builder

1. Create db/sequenceRepository.ts with CRUD operations for sequences table
2. Implement saveSequence() that converts GeneratedSequence + params into a DB row
3. Implement getAllSequences(), getSequenceById(), deleteSequence()
4. Add a 'Save to Portfolio' button in the builder result phase
5. Prompt user for a name (default to AI-generated name)
6. After save, show success feedback and option to view in portfolio
7. Prevent duplicate saves of the same sequence

## Inputs

- `db/database.ts — existing schema from S03`
- `services/types.ts — GeneratedSequence type`
- `app/(tabs)/builder.tsx — builder result phase`

## Expected Output

- `db/sequenceRepository.ts — Sequence CRUD operations`
- `app/(tabs)/builder.tsx — Save to Portfolio button added`

## Verification

Run `npx tsc --noEmit`. Generate a sequence, save it, verify it appears in SQLite.
