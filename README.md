# New Age Yogi Guru 🧘

AI-powered yoga class builder for aspiring teachers.

## Who It's For

Recent graduates of YTT200, YTT300, and YTT500 yoga teacher training programs who need help building fully composed classes, finding safe transitions, and developing their teaching voice.

## Features

- **AI Class Builder** — Choose style, duration, difficulty, and focus areas. Claude AI generates a complete yoga sequence with teaching cues and transitions.
- **Pose Library** — Browse 34 yoga poses with Sanskrit names, teaching cues, contraindications, and body focus tags. Search and filter by category.
- **Class Portfolio** — Save, organize, and manage your AI-generated class sequences.
- **Notes** — Add personal annotations to any pose or saved sequence.
- **AI Chat** — Ask anything about yoga teaching — sequencing, anatomy, modifications, or methodology.
- **Authentication** — Email/password sign up and sign in via Supabase.
- **Cloud Sync** — Saved classes and notes sync to Supabase for cross-device access.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router 6 (file-based) |
| Language | TypeScript 5.9 (strict) |
| AI | Anthropic Claude API (via Express proxy) |
| Local DB | SQLite via expo-sqlite |
| Auth & Cloud | Supabase (Postgres + Auth + RLS) |

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd New_Age_Yogi_Guru
npm install
cd server && npm install && cd ..
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Required variables:
| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key from [Anthropic Console](https://console.anthropic.com/settings/keys) |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL from [Dashboard](https://supabase.com/dashboard) → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key from same page |

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable email auth in Authentication → Providers
3. Run the schema SQL in the SQL Editor:

```bash
cat docs/supabase-schema.sql
# Copy and paste into Supabase SQL Editor
```

This creates the `sequences`, `pose_notes`, and `sequence_notes` tables with Row Level Security.

### 4. Run the App

```bash
# Terminal 1: Start the Claude API proxy
npx tsx server/index.ts

# Terminal 2: Start Expo
npx expo start
```

Then open in:
- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`
- **Web:** Press `w`
- **Expo Go on device:** Scan the QR code

### 5. EAS Builds (Optional)

```bash
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

## Project Structure

```
app/
  (tabs)/                 # Bottom tab navigator (5 tabs)
    index.tsx             # Home — stats + quick actions
    poses.tsx             # Pose Library — search + filter
    builder.tsx           # AI Class Builder — params + generation
    portfolio.tsx         # Portfolio — saved classes
    chat.tsx              # AI Chat — yoga teaching Q&A
  auth/                   # Auth screens (sign-in, sign-up)
  pose/[id].tsx           # Pose detail view
  sequence/[id].tsx       # Saved sequence detail view
components/               # Reusable UI components
constants/Colors.ts       # Earth-tone color palette
context/AuthContext.tsx    # Auth state management
data/                     # Seed pose data (34 poses)
db/                       # SQLite repositories + migration
docs/                     # Supabase schema SQL
lib/                      # Supabase client + cloud repository
server/                   # Express API proxy for Claude
services/                 # Claude API client + yoga prompts
types/                    # TypeScript type definitions
```

## Architecture

```
┌─────────────────────────────────────┐
│           React Native App          │
│  (Expo Router + 5-tab navigation)   │
├─────────────┬───────────────────────┤
│  SQLite     │   Supabase            │
│  (local)    │   (cloud)             │
│  poses      │   sequences (RLS)     │
│  sequences  │   pose_notes (RLS)    │
│  notes      │   sequence_notes (RLS)│
├─────────────┴───────────────────────┤
│         Express API Proxy           │
│    (localhost:3001 → Claude API)    │
└─────────────────────────────────────┘
```

## Development

This project uses [GSD](https://github.com/get-shit-done) for structured development tracking. See `.gsd/` for milestone plans, requirements, and decisions.
