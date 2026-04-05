# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? | Made By |
|---|------|-------|----------|--------|-----------|------------|---------|
| D001 |  | architecture | Mobile framework for New Age Yogi Guru | React Native + Expo | Cross-platform iOS/Android with fast iteration, OTA updates via EAS, large ecosystem of UI libraries, and strong community support. | Yes | human |
| D002 |  | architecture | Target user segment | Recent YTT200/YTT300/YTT500 graduates | Focused niche of aspiring yoga teachers who have foundational knowledge but need help composing full classes, finding transitions, and developing their teaching voice. | Yes | human |
| D003 |  | architecture | Backend-as-a-Service for auth and cloud data | Supabase | Supabase provides auth (email/password + social), Postgres database, row-level security, and real-time subscriptions out of the box. Free tier is generous for MVP. Better DX than Firebase for relational data (sequences, notes). Open source fallback if needed. | Yes | agent |
