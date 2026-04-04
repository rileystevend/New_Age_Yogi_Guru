---
id: T02
parent: S04
milestone: M002
key_files:
  - services/claude.ts
  - services/prompts.ts
  - services/types.ts
  - services/index.ts
key_decisions:
  - JSON extraction falls back through: direct parse → code block → regex object/array match
  - Retry only on 429/500/502/503 — non-retryable errors fail fast
  - Platform-aware baseUrl (10.0.2.2 for Android emulator)
duration: 
verification_result: passed
completed_at: 2026-04-04T20:59:52.427Z
blocker_discovered: false
---

# T02: Built typed Claude API client with streaming, retry logic, JSON parsing, and yoga-specific helpers (generateSequence, suggestTransitions, generateCues)

**Built typed Claude API client with streaming, retry logic, JSON parsing, and yoga-specific helpers (generateSequence, suggestTransitions, generateCues)**

## What Happened

Created four service files: types.ts (ClaudeMessage, ClaudeResponse, StreamEvent, SequenceGenerationParams, GeneratedSequence, GeneratedPose), prompts.ts (system prompts for sequence generation, transitions, and cues with strict JSON output format), claude.ts (sendMessage, sendMessageStreaming with SSE parsing, retry with exponential backoff, timeout handling, robust JSON extraction from Claude responses), and index.ts barrel. Three yoga-specific helpers: generateSequence (streaming with progress callback), suggestTransitions, generateCues. All functions log latency and token usage.

## Verification

npx tsc --noEmit: zero type errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | ✅ pass | 2000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `services/claude.ts`
- `services/prompts.ts`
- `services/types.ts`
- `services/index.ts`
