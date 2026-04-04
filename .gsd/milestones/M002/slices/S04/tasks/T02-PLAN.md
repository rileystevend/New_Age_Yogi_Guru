---
estimated_steps: 10
estimated_files: 4
skills_used: []
---

# T02: Claude API Client Service in React Native

1. Create `services/claude.ts` with typed ClaudeService
2. Define types: ClaudeMessage, ClaudeRequest, ClaudeResponse, StreamChunk
3. Implement sendMessage() that posts to the proxy and handles SSE streaming
4. Implement sendMessageSync() for non-streaming requests
5. Add retry logic with exponential backoff (3 attempts)
6. Add timeout handling (30 second default)
7. Add structured response parsing — extract JSON from Claude's response
8. Create yoga-specific system prompt templates in services/prompts.ts
9. Export typed helper: generateSequence(), suggestTransitions(), generateCues()
10. Add observability: log latency, token usage, errors

## Inputs

- `server/index.ts — API proxy from T01`

## Expected Output

- `services/claude.ts — Claude API client with streaming and retry`
- `services/prompts.ts — Yoga-specific system prompt templates`
- `services/types.ts — Claude API types`
- `services/index.ts — Service barrel exports`

## Verification

Run `npx tsc --noEmit` — zero type errors. Integration test: call generateSequence() from a test screen and verify structured response.
