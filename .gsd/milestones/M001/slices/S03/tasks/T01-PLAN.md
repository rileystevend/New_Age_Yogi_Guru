---
estimated_steps: 8
estimated_files: 4
skills_used: []
---

# T01: Pose Library List Screen with Search and Category Filter

1. Replace the placeholder poses.tsx with a full pose list screen
2. Use FlatList for efficient rendering of 34+ poses
3. Each list item shows: English name, Sanskrit name, category badge, difficulty indicator
4. Add a search bar at the top that filters using searchPoses()
5. Add horizontal category filter chips (scrollable) using getAvailableCategories()
6. Tapping a pose navigates to a detail screen (set up the route but detail screen is T02)
7. Style with the existing earth-tone color palette
8. Handle empty search results with a friendly message

## Inputs

- `data/poses.ts — seed data from S02`
- `data/poseHelpers.ts — search and filter functions from S02`
- `constants/Colors.ts — color palette from S01`

## Expected Output

- `app/(tabs)/poses.tsx — Full pose list screen with search and filters`
- `components/PoseCard.tsx — Reusable pose list item component`
- `components/CategoryFilter.tsx — Horizontal category filter chips`
- `components/SearchBar.tsx — Search input component`

## Verification

Run `npx tsc --noEmit`. Launch app, verify pose list renders all 34 poses, search filters correctly, category chips filter correctly.
