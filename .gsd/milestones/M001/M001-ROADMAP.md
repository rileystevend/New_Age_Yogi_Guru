# M001: Foundation — Expo Scaffold, Navigation, Pose Data Model & Local Storage

## Vision
Stand up a working React Native + Expo app with tab navigation, a typed pose data model, a seed pose library, and local persistence — proving the core architecture before adding AI features.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Expo Scaffold + Tab Navigation | low | — | ✅ | App launches with 4 tabs and placeholder screens on iOS and Android |
| S02 | Pose Data Model + Seed Data | medium | S01 | ✅ | Typed pose data model with 30+ seed poses loaded from JSON fixtures |
| S03 | Pose Library Screen + Detail View + Local Persistence | medium | S02 | ⬜ | User browses a scrollable pose library, taps a pose, sees full details with cues and image placeholder |
