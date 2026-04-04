# S05: Class Builder UI + AI Sequence Generation — UAT

**Milestone:** M002
**Written:** 2026-04-04T21:09:44.791Z

## UAT: Class Builder UI + AI Sequence Generation

### Pre-conditions
- Proxy running: `npx tsx server/index.ts`
- Expo running: `npx expo start`
- ANTHROPIC_API_KEY set in .env

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Form renders | Navigate to Builder tab | Style, Duration, Difficulty, Focus, Intention fields visible |
| 2 | Chip selection | Tap 'Vinyasa' chip | Chip highlights in terracotta |
| 3 | Multi-select | Tap 'Hips' then 'Shoulders' | Both chips highlighted |
| 4 | Validation | Leave fields empty | Generate button greyed out, hint text shown |
| 5 | Form complete | Select all required fields | Generate button active (terracotta) |
| 6 | Generate | Fill form, tap Generate | Loading state with streaming preview |
| 7 | Result display | Wait for generation | Sequence name, warm-up, main, cool-down sections |
| 8 | Pose cards | Check generated poses | Name, Sanskrit, breaths, cues, transition notes |
| 9 | Regenerate | Tap Regenerate button | New sequence generated with same params |
| 10 | New Class | Tap New Class button | Returns to parameter form, cleared |
| 11 | Error handling | Stop proxy, generate | Error message displayed |
| 12 | TypeScript | Run `npx tsc --noEmit` | Zero type errors |

