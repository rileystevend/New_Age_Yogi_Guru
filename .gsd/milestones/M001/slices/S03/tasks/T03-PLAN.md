---
estimated_steps: 7
estimated_files: 3
skills_used: []
---

# T03: Local SQLite Persistence + Git Commit

1. Install expo-sqlite
2. Create db/database.ts with SQLite initialization and pose table schema
3. Create db/poseRepository.ts with CRUD operations that mirror poseHelpers signatures
4. Seed the database with poses from data/poses.ts on first launch
5. Update pose screens to read from SQLite instead of in-memory data
6. Verify data persists across app restarts
7. Git commit with all S03 changes

## Inputs

- `data/poses.ts — seed data for initial DB population`
- `types/pose.ts — Pose type for schema mapping`
- `app/(tabs)/poses.tsx — list screen to update data source`
- `app/pose/[id].tsx — detail screen to update data source`

## Expected Output

- `db/database.ts — SQLite initialization and schema`
- `db/poseRepository.ts — Pose CRUD operations`
- `db/index.ts — Database barrel export`

## Verification

Run `npx tsc --noEmit`. Launch app, browse poses, close app, reopen — poses still visible. Git commit clean.
