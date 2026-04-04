# S03: Pose Library Screen + Detail View + Local Persistence

**Goal:** Build the pose list UI with search/filter, detail screen with all pose fields, and local SQLite persistence
**Demo:** After this: User browses a scrollable pose library, taps a pose, sees full details with cues and image placeholder

## Tasks
- [x] **T01: Built pose library list screen with search bar, horizontal category filter chips, and scrollable pose cards** — 1. Replace the placeholder poses.tsx with a full pose list screen
2. Use FlatList for efficient rendering of 34+ poses
3. Each list item shows: English name, Sanskrit name, category badge, difficulty indicator
4. Add a search bar at the top that filters using searchPoses()
5. Add horizontal category filter chips (scrollable) using getAvailableCategories()
6. Tapping a pose navigates to a detail screen (set up the route but detail screen is T02)
7. Style with the existing earth-tone color palette
8. Handle empty search results with a friendly message
  - Estimate: 30min
  - Files: app/(tabs)/poses.tsx, components/PoseCard.tsx, components/CategoryFilter.tsx, components/SearchBar.tsx
  - Verify: Run `npx tsc --noEmit`. Launch app, verify pose list renders all 34 poses, search filters correctly, category chips filter correctly.
- [x] **T02: Built pose detail screen with image placeholder, quick-ref cards, teaching cues, body focus, contraindications, and tags** — 1. Create app/pose/[id].tsx as a dynamic route for pose details
2. Display all pose fields: English name, Sanskrit name, description, category, difficulty, body focus areas
3. Teaching cues section with numbered cues in a card layout
4. Contraindications section with warning styling
5. Drishti and breath cue in a quick-reference area
6. Placeholder for pose image (styled empty state)
7. Tags displayed as small chips
8. Navigation back to pose list works correctly
9. Handle invalid pose ID with error screen
  - Estimate: 30min
  - Files: app/pose/[id].tsx, app/pose/_layout.tsx
  - Verify: Run `npx tsc --noEmit`. Navigate to a pose detail, verify all fields display. Test with invalid ID.
- [ ] **T03: Local SQLite Persistence + Git Commit** — 1. Install expo-sqlite
2. Create db/database.ts with SQLite initialization and pose table schema
3. Create db/poseRepository.ts with CRUD operations that mirror poseHelpers signatures
4. Seed the database with poses from data/poses.ts on first launch
5. Update pose screens to read from SQLite instead of in-memory data
6. Verify data persists across app restarts
7. Git commit with all S03 changes
  - Estimate: 30min
  - Files: db/database.ts, db/poseRepository.ts, db/index.ts
  - Verify: Run `npx tsc --noEmit`. Launch app, browse poses, close app, reopen — poses still visible. Git commit clean.
