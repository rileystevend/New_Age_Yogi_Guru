---
estimated_steps: 16
estimated_files: 2
skills_used: []
---

# T02: Create 30+ Seed Poses Across All Categories

1. Create `data/poses.ts` with an array of typed Pose objects
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

## Inputs

- `types/pose.ts — Pose types from T01`

## Expected Output

- `data/poses.ts — 30+ typed seed poses`
- `data/index.ts — Barrel export`

## Verification

Run `npx tsc --noEmit` — zero type errors. Import and count poses in a quick script to confirm 30+.
