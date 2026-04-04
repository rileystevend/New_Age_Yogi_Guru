# S02: Pose Data Model + Seed Data

**Goal:** Design the comprehensive pose TypeScript types and create seed data covering major pose categories
**Demo:** After this: Typed pose data model with 30+ seed poses loaded from JSON fixtures

## Tasks
- [x] **T01: Defined comprehensive Pose type system with 11 categories, 13 body focus areas, and SequencePose/YogaSequence types for future class builder** — 1. Create `types/pose.ts` with comprehensive Pose interface
2. Define enums/unions for: PoseCategory (standing, seated, supine, prone, inversion, balance, twist, backbend, forward-fold, arm-balance, restorative), Difficulty (beginner, intermediate, advanced), BodyFocus (hips, hamstrings, shoulders, spine, core, chest, legs, arms, full-body)
3. Pose fields: id, englishName, sanskritName, category, difficulty, bodyFocus (array), description, teachingCues (array of strings), contraindications (array), imageUrl (nullable), tags (array), drishti (gaze point), breathCue
4. Define SequencePose type (pose + hold duration, side, notes) for future class builder use
5. Create `types/index.ts` barrel export
  - Estimate: 15min
  - Files: types/pose.ts, types/index.ts
  - Verify: Run `npx tsc --noEmit` — zero type errors.
- [x] **T02: Created 34 seed poses covering all 11 categories with authentic teaching cues, contraindications, and yoga-specific metadata** — 1. Create `data/poses.ts` with an array of typed Pose objects
2. Cover all PoseCategory values with at least 2-3 poses each:
   - Standing: Mountain, Warrior I, Warrior II, Triangle, Chair
   - Seated: Easy Pose, Staff Pose, Bound Angle, Hero
   - Supine: Corpse, Happy Baby, Bridge
   - Prone: Cobra, Locust, Bow
   - Inversion: Downward Dog, Legs Up Wall, Headstand
   - Balance: Tree, Eagle, Dancer
   - Twist: Seated Twist, Revolved Triangle
   - Backbend: Camel, Wheel, Fish
   - Forward Fold: Standing Forward Fold, Seated Forward Fold, Wide-Legged Forward Fold
   - Arm Balance: Crow, Side Plank
   - Restorative: Child's Pose, Reclined Butterfly, Supported Fish
3. Each pose includes 3-5 teaching cues, body focus areas, contraindications, drishti, and breath cue
4. Use placeholder image references (will be replaced with real images later)
5. Create `data/index.ts` barrel export
  - Estimate: 45min
  - Files: data/poses.ts, data/index.ts
  - Verify: Run `npx tsc --noEmit` — zero type errors. Import and count poses in a quick script to confirm 30+.
- [ ] **T03: Pose Data Access Helpers + Git Commit** — 1. Create `data/poseHelpers.ts` with utility functions:
   - `getPoseById(id: string): Pose | undefined`
   - `getPosesByCategory(category: PoseCategory): Pose[]`
   - `getPosesByDifficulty(difficulty: Difficulty): Pose[]`
   - `getPosesByBodyFocus(focus: BodyFocus): Pose[]`
   - `searchPoses(query: string): Pose[]` — searches name, Sanskrit name, tags
   - `getPoseCount(): number`
2. Log pose count at module load for observability
3. Git commit with pose data model and seed data
  - Estimate: 15min
  - Files: data/poseHelpers.ts
  - Verify: Run `npx tsc --noEmit` — zero type errors. Git commit is clean.
