# S02: Pose Data Model + Seed Data — UAT

**Milestone:** M001
**Written:** 2026-04-04T01:07:20.722Z

## UAT: Pose Data Model + Seed Data

### Pre-conditions
- Project dependencies installed
- TypeScript compiles without errors

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Type safety | Run `npx tsc --noEmit` | Zero type errors |
| 2 | Pose count | Import poses array, check length | 34 poses |
| 3 | Category coverage | Group poses by category | All 11 categories have 2+ poses |
| 4 | Teaching cues | Check any pose's teachingCues | 3-5 cues per pose, natural teacher language |
| 5 | Search by name | Call searchPoses('warrior') | Returns Warrior I, Warrior II |
| 6 | Search by Sanskrit | Call searchPoses('tadasana') | Returns Mountain Pose |
| 7 | Filter by category | Call getPosesByCategory('balance') | Returns 3 balance poses |
| 8 | Filter by body focus | Call getPosesByBodyFocus('hips') | Returns multiple poses |
| 9 | Get by ID | Call getPoseById('downward-dog') | Returns Downward-Facing Dog |
| 10 | Missing ID | Call getPoseById('nonexistent') | Returns undefined |

