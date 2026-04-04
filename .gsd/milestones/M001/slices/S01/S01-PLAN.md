# S01: Expo Scaffold + Tab Navigation

**Goal:** Create the Expo project with TypeScript, install dependencies, and wire up tab navigation with placeholder screens
**Demo:** After this: App launches with 4 tabs and placeholder screens on iOS and Android

## Tasks
- [x] **T01: Scaffolded Expo project with TypeScript strict mode, installed all dependencies, configured app identity as New Age Yogi Guru** — 1. Run `npx create-expo-app@latest` with TypeScript template
2. Configure `tsconfig.json` with strict mode enabled
3. Install core dependencies: `expo-router` for file-based routing, `react-native-safe-area-context`, `react-native-screens`, `expo-status-bar`
4. Install UI library: `@expo/vector-icons` for tab icons
5. Verify the default app boots with `npx expo start`
6. Clean out default boilerplate screens
7. Add `.gitignore` appropriate for Expo projects
8. Create initial `app.json` / `app.config.ts` with app name 'New Age Yogi Guru' and slug
  - Estimate: 20min
  - Files: package.json, tsconfig.json, app.json, app.config.ts, .gitignore
  - Verify: Run `npx tsc --noEmit` and confirm zero type errors.
- [x] **T02: Wired up 4-tab navigation (Home, Poses, Builder, Portfolio) with yoga-themed styling and placeholder content** — 1. Set up expo-router file-based routing in `app/` directory
2. Create root layout `app/_layout.tsx` with tab navigator
3. Create 4 tab screens:
   - `app/(tabs)/index.tsx` — Home tab
   - `app/(tabs)/poses.tsx` — Pose Library tab
   - `app/(tabs)/builder.tsx` — Class Builder tab
   - `app/(tabs)/portfolio.tsx` — Portfolio tab
4. Configure tab bar with icons from `@expo/vector-icons`
5. Style tab bar with yoga-inspired color scheme
6. Each placeholder screen shows tab name and description
7. Add tabs layout `app/(tabs)/_layout.tsx`
8. Verify navigation between all 4 tabs
  - Estimate: 30min
  - Files: app/_layout.tsx, app/(tabs)/_layout.tsx, app/(tabs)/index.tsx, app/(tabs)/poses.tsx, app/(tabs)/builder.tsx, app/(tabs)/portfolio.tsx
  - Verify: Run `npx tsc --noEmit` for zero type errors. Launch app and confirm 4 tabs render.
- [x] **T03: Created README.md, PROJECT.md, updated .gitignore, and committed initial project scaffolding** — 1. Write README.md with project description, target users, tech stack, setup instructions, and project structure
2. Write .gsd/PROJECT.md as GSD living document
3. Create initial git commit with all scaffolding
  - Estimate: 10min
  - Files: README.md, .gsd/PROJECT.md
  - Verify: README.md exists with setup instructions. Git log shows initial commit. `git status` is clean.
