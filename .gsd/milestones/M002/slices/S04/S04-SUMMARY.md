---
id: S04
parent: M002
milestone: M002
provides:
  - Claude API client service
  - Yoga-specific AI helpers (generateSequence, suggestTransitions, generateCues)
  - Express API proxy
  - GeneratedSequence type for downstream consumers
requires:
  - slice: S01
    provides: App shell and navigation
  - slice: S02
    provides: Pose type system
affects:
  - S05
  - S06
  - S08
key_files:
  - server/index.ts
  - services/claude.ts
  - services/prompts.ts
  - services/types.ts
  - services/index.ts
  - app/(tabs)/builder.tsx
  - .env.example
key_decisions:
  - Express proxy for API key security
  - SSE streaming for real-time feedback
  - Strict JSON system prompts for reliable parsing
  - Retry only on 429/5xx — non-retryable errors fail fast
  - JSON extraction fallback chain for robustness
patterns_established:
  - API proxy pattern: Express server in server/ proxies to external APIs
  - Claude service pattern: typed helpers with streaming callbacks
  - System prompt pattern: strict JSON output format with schema documentation
observability_surfaces:
  - [Proxy] Request latency and model logged
  - [Claude] Sync/stream response timing and token counts logged
  - [Builder] Generated sequence name and pose count logged
drill_down_paths:
  - .gsd/milestones/M002/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S04/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S04/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-04T21:03:16.076Z
blocker_discovered: false
---

# S04: Claude API Service Layer + Streaming

**Built Claude API proxy, typed client service with streaming/retry, and yoga-specific helpers that generate complete class sequences**

## What Happened

S04 delivered the full AI integration layer in three tasks. T01 built an Express API proxy (server/index.ts) that secures the Anthropic API key server-side, supports both streaming (SSE passthrough) and synchronous responses, with health check and error handling. T02 created the typed client service (services/claude.ts) with sendMessage, sendMessageStreaming (SSE parser), retry with exponential backoff, timeout handling, and robust JSON extraction from Claude responses. Yoga-specific system prompts enforce strict JSON output for sequences, transitions, and cues. Three helper functions: generateSequence (streaming with progress), suggestTransitions, generateCues. T03 verified end-to-end by generating a real yoga class — 'Gentle Gateway: Opening Hips with Ease' — with warm-up, main, and cool-down sections, bilateral poses, teaching cues, and transition notes.

## Verification

Health check endpoint returns OK. Non-streaming curl test returns Claude response. End-to-end browser test: generate button → streaming → parsed sequence with all sections rendered. TypeScript zero errors.

## Requirements Advanced

- R001 — AI generates complete yoga class sequences from parameters
- R003 — Transition notes generated between every pose in the sequence
- R004 — Teaching cues generated contextually for each pose in the sequence

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

Proxy runs locally — production deployment needed in M004. Test params are hardcoded in builder screen — real parameter selection UI comes in S05.

## Follow-ups

Build parameter selection UI (S05). Add rate limiting to proxy. Deploy proxy to production (M004/S12).

## Files Created/Modified

- `server/index.ts` — Express proxy with Claude API passthrough, streaming, error handling
- `server/package.json` — Server dependencies (express, cors, dotenv)
- `server/tsconfig.json` — Server TypeScript config
- `services/claude.ts` — Typed Claude client with streaming, retry, JSON parsing
- `services/prompts.ts` — Yoga-specific system prompts for sequence/transition/cue generation
- `services/types.ts` — Claude API and yoga sequence types
- `services/index.ts` — Service barrel exports
- `app/(tabs)/builder.tsx` — Builder screen with working AI sequence generation
- `.env.example` — Template for required environment variables
