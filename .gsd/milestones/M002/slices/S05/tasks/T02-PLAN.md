---
estimated_steps: 9
estimated_files: 2
skills_used: []
---

# T02: Integrate Parameter Form with AI Generation + Sequence Display

1. Wire the parameter form to generateSequence() with real user selections
2. Show loading state with streaming progress indicator during generation
3. After generation, display the full sequence with warm-up, main, cool-down sections
4. Extract SequenceDisplay component for rendering a GeneratedSequence
5. Add a 'Regenerate' button that clears and regenerates with same params
6. Add a 'New Class' button to reset the form
7. Handle errors with friendly messages and retry option
8. Log parameter combinations and generation time
9. Git commit

## Inputs

- `services/claude.ts — generateSequence from S04`
- `app/(tabs)/builder.tsx — parameter form from T01`

## Expected Output

- `app/(tabs)/builder.tsx — Complete builder with form + generation + display`
- `components/SequenceDisplay.tsx — Reusable sequence renderer`

## Verification

Run `npx tsc --noEmit`. Generate sequences with different parameter combinations. Verify regenerate and new class flows work. Git commit clean.
