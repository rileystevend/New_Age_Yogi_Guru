---
estimated_steps: 12
estimated_files: 6
skills_used: []
---

# T02: Wire Up Tab Navigation with 4 Placeholder Screens

1. Set up expo-router file-based routing in `app/` directory
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

## Inputs

- `package.json — from T01`
- `tsconfig.json — from T01`

## Expected Output

- `app/_layout.tsx — Root layout`
- `app/(tabs)/_layout.tsx — Tab navigator with 4 tabs`
- `app/(tabs)/index.tsx — Home screen`
- `app/(tabs)/poses.tsx — Pose Library screen`
- `app/(tabs)/builder.tsx — Class Builder screen`
- `app/(tabs)/portfolio.tsx — Portfolio screen`

## Verification

Run `npx tsc --noEmit` for zero type errors. Launch app and confirm 4 tabs render.
