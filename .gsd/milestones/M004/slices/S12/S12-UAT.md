# S12: Launch Prep — EAS Build, API Proxy Deployment & README — UAT

**Milestone:** M004
**Written:** 2026-04-05T04:45:53.556Z

## UAT: Launch Prep

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | README | Read README.md | Complete setup instructions, all sections present |
| 2 | .env.example | Check .env.example | All 4 required vars listed |
| 3 | EAS config | Check eas.json | 3 profiles: development, preview, production |
| 4 | TypeScript | Run `npx tsc --noEmit` | Zero errors |
| 5 | Git clean | Run `git status` | Working tree clean |

