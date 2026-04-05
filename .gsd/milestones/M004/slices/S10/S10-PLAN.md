# S10: Authentication — Sign Up, Sign In, Sign Out

**Goal:** Implement auth with Supabase (email/password), secure token storage, and auth-gated screens
**Demo:** After this: User creates account, signs in, sees their data, signs out, data is gone until re-sign-in

## Tasks
- [x] **T01: Implemented Supabase auth with sign in/up screens, AuthContext, auth-gated routing, and sign out** — 1. Install @supabase/supabase-js and configure with project URL + anon key from env
2. Create lib/supabase.ts with Supabase client initialization
3. Create context/AuthContext.tsx with React context providing: user, session, signIn, signUp, signOut, loading
4. Use Supabase onAuthStateChange listener for session management
5. Create app/auth/sign-in.tsx with email/password form
6. Create app/auth/sign-up.tsx with email/password + confirm password form
7. Add auth gate in root layout: redirect to sign-in if no session
8. Style auth screens with yoga-themed design
9. Handle auth errors with friendly messages
10. Store session using Supabase's built-in AsyncStorage adapter
11. Git commit
  - Estimate: 40min
  - Files: lib/supabase.ts, context/AuthContext.tsx, app/auth/sign-in.tsx, app/auth/sign-up.tsx, app/auth/_layout.tsx, app/_layout.tsx
  - Verify: Run `npx tsc --noEmit`. Launch app — redirects to sign-in. Sign up with email, redirected to main app. Sign out returns to sign-in.
