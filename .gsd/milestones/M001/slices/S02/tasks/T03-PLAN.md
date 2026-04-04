---
estimated_steps: 9
estimated_files: 1
skills_used: []
---

# T03: Pose Data Access Helpers + Git Commit

1. Create `data/poseHelpers.ts` with utility functions:
   - `getPoseById(id: string): Pose | undefined`
   - `getPosesByCategory(category: PoseCategory): Pose[]`
   - `getPosesByDifficulty(difficulty: Difficulty): Pose[]`
   - `getPosesByBodyFocus(focus: BodyFocus): Pose[]`
   - `searchPoses(query: string): Pose[]` — searches name, Sanskrit name, tags
   - `getPoseCount(): number`
2. Log pose count at module load for observability
3. Git commit with pose data model and seed data

## Inputs

- `types/pose.ts — Pose types from T01`
- `data/poses.ts — Seed data from T02`

## Expected Output

- `data/poseHelpers.ts — Data access utilities`

## Verification

Run `npx tsc --noEmit` — zero type errors. Git commit is clean.
