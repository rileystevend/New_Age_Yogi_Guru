# S07: Notes System — Pose & Sequence Annotations — UAT

**Milestone:** M003
**Written:** 2026-04-04T22:17:43.411Z

## UAT: Notes System

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Add pose note | Open pose detail, type note, tap Add | Note appears in list |
| 2 | Edit pose note | Tap Edit on a note, change text, tap Save | Note updated |
| 3 | Delete pose note | Tap Delete, confirm | Note removed |
| 4 | Pose note persistence | Add note, close app, reopen | Note still there |
| 5 | Add sequence note | Open saved sequence, add note | Note appears |
| 6 | Empty state | Open pose with no notes | Hint text shown |
| 7 | Multiple notes | Add 3 notes to a pose | All 3 displayed, newest first |

