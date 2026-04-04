---
estimated_steps: 8
estimated_files: 5
skills_used: []
---

# T01: Create Expo Project with TypeScript + Install Core Dependencies

1. Run `npx create-expo-app@latest` with TypeScript template
2. Configure `tsconfig.json` with strict mode enabled
3. Install core dependencies: `expo-router` for file-based routing, `react-native-safe-area-context`, `react-native-screens`, `expo-status-bar`
4. Install UI library: `@expo/vector-icons` for tab icons
5. Verify the default app boots with `npx expo start`
6. Clean out default boilerplate screens
7. Add `.gitignore` appropriate for Expo projects
8. Create initial `app.json` / `app.config.ts` with app name 'New Age Yogi Guru' and slug

## Inputs

- `package.json`

## Expected Output

- `package.json — Expo project with all dependencies`
- `tsconfig.json — Strict TypeScript configuration`
- `app.json — Expo app configuration`
- `.gitignore — Expo-appropriate ignore rules`

## Verification

Run `npx tsc --noEmit` and confirm zero type errors.
