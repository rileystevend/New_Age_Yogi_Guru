---
estimated_steps: 9
estimated_files: 2
skills_used: []
---

# T01: Class Parameter Selection UI

1. Redesign builder.tsx with a proper parameter form replacing hardcoded test params
2. Style selector: horizontal chips for vinyasa, hatha, yin, restorative, power, ashtanga
3. Duration picker: 15, 30, 45, 60, 75, 90 minute options as chips
4. Difficulty selector: beginner, intermediate, advanced as chips
5. Focus area multi-select: chips for hips, hamstrings, shoulders, spine, core, chest, legs, full-body
6. Intention text input: freeform field for class theme/intention
7. Add form validation — require at least style, duration, difficulty, and one focus area
8. Generate button disabled until required fields are filled
9. Extract reusable ChipSelector component

## Inputs

- `constants/Colors.ts — color palette`
- `services/types.ts — SequenceGenerationParams type`

## Expected Output

- `app/(tabs)/builder.tsx — Builder screen with parameter form`
- `components/ChipSelector.tsx — Reusable chip selector component`

## Verification

Run `npx tsc --noEmit`. Launch app, verify all parameter controls render and respond to selection. Generate button enables only when required fields are filled.
