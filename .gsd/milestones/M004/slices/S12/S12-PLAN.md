# S12: Launch Prep — EAS Build, API Proxy Deployment & README

**Goal:** Configure EAS build pipeline, finalize README, and prepare the project for distribution
**Demo:** After this: EAS builds succeed for iOS/Android. API proxy deployable. README updated with full setup.

## Tasks
- [ ] **T01: EAS Config + Final README + Project Wrap-Up** — 1. Create eas.json with development, preview, and production build profiles
2. Update README.md with complete setup: Supabase schema, proxy, env vars, EAS builds
3. Update .env.example with all required vars
4. Update .gitignore to exclude server/node_modules
5. Update PROJECT.md to final state
6. Final git commit
  - Estimate: 20min
  - Files: eas.json, README.md, .env.example, .gitignore, .gsd/PROJECT.md
  - Verify: Run `npx tsc --noEmit`. README covers all setup steps. Git status clean.
