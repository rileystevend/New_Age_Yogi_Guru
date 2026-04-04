---
estimated_steps: 9
estimated_files: 2
skills_used: []
---

# T02: Pose Detail Screen with Teaching Cues and Metadata

1. Create app/pose/[id].tsx as a dynamic route for pose details
2. Display all pose fields: English name, Sanskrit name, description, category, difficulty, body focus areas
3. Teaching cues section with numbered cues in a card layout
4. Contraindications section with warning styling
5. Drishti and breath cue in a quick-reference area
6. Placeholder for pose image (styled empty state)
7. Tags displayed as small chips
8. Navigation back to pose list works correctly
9. Handle invalid pose ID with error screen

## Inputs

- `data/poseHelpers.ts — getPoseById from S02`
- `constants/Colors.ts — color palette from S01`

## Expected Output

- `app/pose/[id].tsx — Pose detail screen with all fields`
- `app/pose/_layout.tsx — Stack layout for pose routes`

## Verification

Run `npx tsc --noEmit`. Navigate to a pose detail, verify all fields display. Test with invalid ID.
