---
estimated_steps: 11
estimated_files: 6
skills_used: []
---

# T01: Supabase Setup + Auth Context + Sign In/Up Screens

1. Install @supabase/supabase-js and configure with project URL + anon key from env
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

## Inputs

- `.env — SUPABASE_URL and SUPABASE_ANON_KEY`

## Expected Output

- `lib/supabase.ts — Supabase client`
- `context/AuthContext.tsx — Auth context provider`
- `app/auth/sign-in.tsx — Sign in screen`
- `app/auth/sign-up.tsx — Sign up screen`
- `app/auth/_layout.tsx — Auth route layout`

## Verification

Run `npx tsc --noEmit`. Launch app — redirects to sign-in. Sign up with email, redirected to main app. Sign out returns to sign-in.
