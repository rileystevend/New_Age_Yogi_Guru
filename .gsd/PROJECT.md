# New Age Yogi Guru

## What It Is

An AI-powered mobile app that helps aspiring yoga teachers build fully composed class sequences. Targeted at recent YTT200/YTT300/YTT500 graduates.

## Current State

- **Phase:** M004 complete — all milestones delivered
- **Platform:** React Native 0.81 + Expo SDK 54, TypeScript strict mode
- **AI Backend:** Anthropic Claude API via Express proxy
- **Auth & Cloud:** Supabase (email auth, Postgres with RLS, dual-write sync)
- **Navigation:** 5-tab layout (Home, Poses, Builder, Portfolio, Chat)
- **Data:** SQLite (local) + Supabase Postgres (cloud) with dual-write

## All Features

1. **Pose Library** — 34 poses with search, category filters, detail views, teaching cues
2. **AI Class Builder** — Parameter selection → Claude generates complete sequences with teaching cues and transitions
3. **Portfolio** — Save, list, view, and delete generated classes
4. **Notes** — Add/edit/delete on any pose or saved sequence
5. **AI Chat** — Freeform yoga teaching Q&A with streaming responses
6. **Home Dashboard** — Dynamic stats, tappable navigation to all features
7. **Authentication** — Email/password via Supabase
8. **Cloud Sync** — Dual-write to Supabase for cross-device data persistence
9. **Error Handling** — Global error boundary, inline errors, offline resilience

## Requirements Status

- R001 (Class Builder) ✅ Validated
- R002 (Pose Library) ✅ Validated
- R003 (Transitions) ✅ Advanced
- R004 (Teaching Cues) ✅ Advanced
- R005 (Portfolio) ✅ Validated
- R006 (Notes) ✅ Validated
- R007 (AI Chat) ✅ Validated
- R008 (Cross-platform) ✅ Advanced
- R009 (Auth + Cloud Sync) ✅ Advanced
