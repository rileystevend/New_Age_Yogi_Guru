# New Age Yogi Guru

## What It Is

An AI-powered mobile app that helps aspiring yoga teachers build fully composed class sequences. Targeted at recent YTT200/YTT300/YTT500 graduates.

## Current State

- **Phase:** Foundation (M001)
- **Platform:** React Native + Expo, TypeScript strict mode
- **AI Backend:** Anthropic Claude API (not yet integrated)
- **Navigation:** 4-tab layout (Home, Poses, Builder, Portfolio) with placeholder screens
- **Data:** No persistence layer yet

## Core Features (Planned)

1. AI Class Builder — generate sequences by style, duration, focus, level
2. Pose Library — browse poses with images, Sanskrit names, teaching cues
3. AI Transitions — safe segues between poses
4. Teaching Cues — verbal instructions per pose
5. Class Portfolio — save and organize sequences
6. Notes — annotate poses and sequences
7. AI Chat — freeform yoga teaching Q&A

## Tech Stack

- React Native 0.81 + Expo SDK 54
- Expo Router 6 (file-based routing)
- TypeScript 5.9 (strict)
- Anthropic Claude API (M002)
- Local SQLite via expo-sqlite (M001/S03)
- Auth + Cloud Sync (M004)
