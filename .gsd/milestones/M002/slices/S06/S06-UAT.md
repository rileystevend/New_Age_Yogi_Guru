# S06: Sequence Editor + Portfolio Save — UAT

**Milestone:** M002
**Written:** 2026-04-04T21:13:48.065Z

## UAT: Sequence Editor + Portfolio Save

### Pre-conditions
- Proxy and Expo running
- At least one sequence generated via Builder

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Save button | Generate a sequence in Builder | 'Save to Portfolio' button visible below action bar |
| 2 | Save | Tap Save to Portfolio | Button disappears, success banner with 'View Portfolio' link |
| 3 | No double save | After saving, check builder | Save button no longer shown |
| 4 | Portfolio list | Navigate to Portfolio tab | Saved class appears with name, style, duration, date |
| 5 | Empty portfolio | Delete all sequences | 'No saved classes' message with Build a Class CTA |
| 6 | View detail | Tap a saved class | Full sequence displayed with all sections |
| 7 | Delete from detail | Tap Delete button on detail | Confirmation dialog, then returns to portfolio |
| 8 | Delete from list | Long-press a saved class | Confirmation dialog, then class removed from list |
| 9 | Reload on focus | Save in builder, go to portfolio | New class appears without manual refresh |
| 10 | TypeScript | Run `npx tsc --noEmit` | Zero type errors |

