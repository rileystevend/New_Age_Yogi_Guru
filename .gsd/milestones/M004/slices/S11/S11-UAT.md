# S11: Cloud Sync — Sequences & Notes to Supabase — UAT

**Milestone:** M004
**Written:** 2026-04-05T04:43:48.157Z

## UAT: Cloud Sync

### Pre-conditions
- Supabase tables created (run docs/supabase-schema.sql)
- Authenticated user session active

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Save syncs | Save a sequence while authenticated | Appears in Supabase dashboard |
| 2 | Delete syncs | Delete a sequence | Removed from Supabase |
| 3 | Note syncs | Add a pose note | Appears in Supabase pose_notes |
| 4 | Offline save | Stop Supabase/disconnect, save sequence | Local save succeeds, cloud logs warning |
| 5 | RLS | Check Supabase data | Only current user's data visible |

