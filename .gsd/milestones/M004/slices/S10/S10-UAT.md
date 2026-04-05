# S10: Authentication — Sign Up, Sign In, Sign Out — UAT

**Milestone:** M004
**Written:** 2026-04-05T04:40:56.297Z

## UAT: Authentication

### Pre-conditions
- Supabase project configured with email auth enabled
- EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Auth gate | Launch app without session | Sign In screen shown |
| 2 | Sign Up | Tap Sign Up link, fill form | Success message, check email prompt |
| 3 | Sign In | Enter valid credentials | Redirected to Home with tabs |
| 4 | Invalid login | Enter wrong password | Error message shown |
| 5 | Session persistence | Sign in, close app, reopen | Still signed in |
| 6 | Sign Out | Tap Sign Out on Home | Returns to Sign In screen |
| 7 | User email | Sign in, check Home | Email displayed near sign out |

