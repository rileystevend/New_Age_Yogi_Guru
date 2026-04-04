# New Age Yogi Guru

## What It Is

An AI-powered mobile app that helps aspiring yoga teachers build fully composed class sequences. Targeted at recent YTT200/YTT300/YTT500 graduates.

## Current State

- **Phase:** M003 complete (Notes, Chat & Polish)
- **Platform:** React Native 0.81 + Expo SDK 54, TypeScript strict mode
- **AI Backend:** Anthropic Claude API via Express proxy
- **Navigation:** 5-tab layout (Home, Poses, Builder, Portfolio, Chat)
- **Data:** SQLite via expo-sqlite with poses, sequences, and notes
- **Milestones:** M001 ✅, M002 ✅, M003 ✅, M004 pending

## Working Features

1. **Pose Library** — 34 poses browsable with search and category filters, detail view with teaching cues
2. **AI Class Builder** — Parameter selection (style, duration, difficulty, focus, intention) → Claude generates complete sequence
3. **Portfolio** — Save, list, view, and delete generated classes
4. **Notes** — Add/edit/delete notes on any pose or saved sequence
5. **AI Chat** — Freeform yoga teaching Q&A with streaming responses
6. **Home Dashboard** — Dynamic stats (pose count, saved classes) with tappable quick actions

## Tech Stack

- React Native 0.81 + Expo SDK 54
- Expo Router 6 (file-based routing)
- TypeScript 5.9 (strict)
- Anthropic Claude API (via Express proxy on localhost:3001)
- SQLite via expo-sqlite (poses, sequences, notes)
- Metro with WASM support for web SQLite

## Architecture

```
app/                    # Expo Router screens
  (tabs)/               # Bottom tab navigator (5 tabs)
  pose/[id].tsx         # Pose detail (dynamic route)
  sequence/[id].tsx     # Sequence detail (dynamic route)
components/             # Reusable UI components
constants/Colors.ts     # Earth-tone color palette
data/                   # Seed pose data
db/                     # SQLite repositories (poses, sequences, notes)
server/                 # Express API proxy for Claude
services/               # Claude API client + yoga prompts
types/                  # TypeScript type definitions
```
