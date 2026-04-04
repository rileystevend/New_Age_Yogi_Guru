# S01: Expo Scaffold + Tab Navigation — UAT

**Milestone:** M001
**Written:** 2026-04-04T01:01:29.579Z

## UAT: Expo Scaffold + Tab Navigation

### Pre-conditions
- Node.js installed
- npm dependencies installed (`npm install`)

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | App boots | Run `npx expo start`, open in browser/simulator | App loads without errors, Home screen visible |
| 2 | Home tab | Observe home screen | Shows 🧘 emoji, "New Age Yogi Guru" title, 3 feature cards |
| 3 | Poses tab | Tap "Poses" tab | Shows "Pose Library" with placeholder content |
| 4 | Builder tab | Tap "Builder" tab | Shows "Class Builder" with placeholder content |
| 5 | Portfolio tab | Tap "Portfolio" tab | Shows "Portfolio" with placeholder content |
| 6 | Tab navigation | Tap between all 4 tabs rapidly | Smooth transitions, no crashes, correct content per tab |
| 7 | Tab icons | Observe tab bar | 4 distinct icons visible, active tab highlighted in terracotta |
| 8 | TypeScript | Run `npx tsc --noEmit` | Zero type errors |

