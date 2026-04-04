# S05: Class Builder UI + AI Sequence Generation

**Goal:** Build the class builder screen with parameter inputs and integrate AI sequence generation with prompt engineering
**Demo:** After this: User selects class parameters and receives a complete AI-generated yoga sequence

## Tasks
- [x] **T01: Built class parameter selection UI with ChipSelector for style, duration, difficulty, focus areas, and intention text input** — 1. Redesign builder.tsx with a proper parameter form replacing hardcoded test params
2. Style selector: horizontal chips for vinyasa, hatha, yin, restorative, power, ashtanga
3. Duration picker: 15, 30, 45, 60, 75, 90 minute options as chips
4. Difficulty selector: beginner, intermediate, advanced as chips
5. Focus area multi-select: chips for hips, hamstrings, shoulders, spine, core, chest, legs, full-body
6. Intention text input: freeform field for class theme/intention
7. Add form validation — require at least style, duration, difficulty, and one focus area
8. Generate button disabled until required fields are filled
9. Extract reusable ChipSelector component
  - Estimate: 30min
  - Files: app/(tabs)/builder.tsx, components/ChipSelector.tsx
  - Verify: Run `npx tsc --noEmit`. Launch app, verify all parameter controls render and respond to selection. Generate button enables only when required fields are filled.
- [x] **T02: Integrated parameter form with AI generation, extracted SequenceDisplay component, added regenerate and new class flows** — 1. Wire the parameter form to generateSequence() with real user selections
2. Show loading state with streaming progress indicator during generation
3. After generation, display the full sequence with warm-up, main, cool-down sections
4. Extract SequenceDisplay component for rendering a GeneratedSequence
5. Add a 'Regenerate' button that clears and regenerates with same params
6. Add a 'New Class' button to reset the form
7. Handle errors with friendly messages and retry option
8. Log parameter combinations and generation time
9. Git commit
  - Estimate: 30min
  - Files: app/(tabs)/builder.tsx, components/SequenceDisplay.tsx
  - Verify: Run `npx tsc --noEmit`. Generate sequences with different parameter combinations. Verify regenerate and new class flows work. Git commit clean.
