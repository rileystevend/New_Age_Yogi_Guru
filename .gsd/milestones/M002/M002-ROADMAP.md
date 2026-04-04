# M002: AI Core — Claude Integration, Class Builder & Sequence Generation

## Vision
Integrate the Claude API to power the core AI features: generating full yoga class sequences, suggesting transitions between poses, and providing teaching cues — the heart of the app's value proposition.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S04 | Claude API Service Layer + Streaming | high | — | ✅ | App sends a prompt to Claude and streams the response in real-time |
| S05 | Class Builder UI + AI Sequence Generation | high | S04 | ✅ | User selects class parameters and receives a complete AI-generated yoga sequence |
| S06 | Sequence Editor + Portfolio Save | medium | S05 | ⬜ | User edits an AI-generated sequence (reorder, add, remove poses) and saves it to their portfolio |
