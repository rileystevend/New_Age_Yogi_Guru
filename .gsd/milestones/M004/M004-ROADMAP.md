# M004: Auth, Cloud Sync & Launch Readiness

## Vision
Add user authentication, cloud data sync so portfolios persist across devices, and prepare for App Store / Play Store submission — making the app production-ready for real yoga teachers.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S10 | Authentication — Sign Up, Sign In, Sign Out | medium | — | ✅ | User creates account, signs in, sees their data, signs out, data is gone until re-sign-in |
| S11 | Cloud Sync — Sequences & Notes to Supabase | high | S10 | ⬜ | User saves a class, data syncs to Supabase Postgres. Sign in on another device, classes appear. |
| S12 | Launch Prep — EAS Build, API Proxy Deployment & README | medium | S11 | ⬜ | EAS builds succeed for iOS/Android. API proxy deployable. README updated with full setup. |
