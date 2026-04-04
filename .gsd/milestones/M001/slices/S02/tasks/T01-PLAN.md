---
estimated_steps: 5
estimated_files: 2
skills_used: []
---

# T01: Define Pose TypeScript Types and Enums

1. Create `types/pose.ts` with comprehensive Pose interface
2. Define enums/unions for: PoseCategory (standing, seated, supine, prone, inversion, balance, twist, backbend, forward-fold, arm-balance, restorative), Difficulty (beginner, intermediate, advanced), BodyFocus (hips, hamstrings, shoulders, spine, core, chest, legs, arms, full-body)
3. Pose fields: id, englishName, sanskritName, category, difficulty, bodyFocus (array), description, teachingCues (array of strings), contraindications (array), imageUrl (nullable), tags (array), drishti (gaze point), breathCue
4. Define SequencePose type (pose + hold duration, side, notes) for future class builder use
5. Create `types/index.ts` barrel export

## Inputs

- `tsconfig.json — TypeScript config from S01`

## Expected Output

- `types/pose.ts — Complete Pose type system with enums`
- `types/index.ts — Barrel export`

## Verification

Run `npx tsc --noEmit` — zero type errors.
