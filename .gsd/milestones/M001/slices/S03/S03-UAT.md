# S03: Pose Library Screen + Detail View + Local Persistence — UAT

**Milestone:** M001
**Written:** 2026-04-04T01:15:38.390Z

## UAT: Pose Library Screen + Detail View + Local Persistence

### Pre-conditions
- App running via `npx expo start`
- Database seeded with 34 poses

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Pose list loads | Navigate to Poses tab | 34 poses displayed in alphabetical order |
| 2 | Search by name | Type "warrior" in search bar | Warrior I and Warrior II shown |
| 3 | Search by Sanskrit | Type "tadasana" in search bar | Mountain Pose shown |
| 4 | Category filter | Tap "Balance" chip | Only Tree, Eagle, Dancer poses shown |
| 5 | Clear filter | Tap "All" chip after filtering | All 34 poses shown again |
| 6 | Combined search + filter | Search "pose" and select "Standing" | Only standing poses with "pose" in name |
| 7 | Empty results | Search "xyznonexistent" | Empty state with "No poses found" message |
| 8 | Pose detail | Tap any pose card | Detail screen with all fields: name, Sanskrit, description, cues, etc. |
| 9 | Teaching cues | View detail for Mountain Pose | 5 numbered teaching cues displayed |
| 10 | Contraindications | View detail for Headstand | Warning-styled contraindications shown |
| 11 | Back navigation | Tap back arrow on detail screen | Returns to pose list with filters preserved |
| 12 | TypeScript | Run `npx tsc --noEmit` | Zero type errors |

