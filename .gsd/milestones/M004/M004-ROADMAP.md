# M004: Auth, Cloud Sync & Launch Readiness

## Vision
Add user authentication, cloud data sync so portfolios persist across devices, and prepare for App Store / Play Store submission — making the app production-ready for real yoga teachers.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S10 | Authentication — Sign Up, Sign In, Sign Out | medium | — | ⬜ | User creates account, signs in, sees their data, signs out, data is gone until re-sign-in |
| S11 | Cloud Sync — Portfolio, Notes & Data Migration | high | S10 | ⬜ | User creates a class on device A, opens app on device B, class appears after sync |
| S12 | Launch Prep — Store Submission, API Proxy & Legal | medium | S11 | ⬜ | App is submitted to both stores with all required assets, proxy secures API keys, legal pages accessible |
