---
estimated_steps: 7
estimated_files: 4
skills_used: []
---

# T01: Home Screen Polish + Onboarding + Error Boundary + Git Commit

1. Update Home screen with dynamic content: recent saved classes, pose count, quick actions that navigate
2. Make the 3 feature cards tappable — navigate to Poses, Builder, Portfolio tabs
3. Add a simple onboarding check: show welcome modal on first launch (AsyncStorage flag)
4. Create a global ErrorBoundary component that catches render errors with friendly fallback
5. Wrap the root layout with ErrorBoundary
6. Update PROJECT.md with current state
7. Git commit with all M003 changes

## Inputs

- `db/sequenceRepository.ts — getSequenceCount`
- `db/poseRepository.ts — getPoseCount`

## Expected Output

- `app/(tabs)/index.tsx — Polished home screen with dynamic content`
- `components/ErrorBoundary.tsx — Global error boundary`

## Verification

Run `npx tsc --noEmit`. Launch app — home screen shows dynamic content. Error boundary catches test error. Git commit clean.
