# S04: Claude API Service Layer + Streaming

**Goal:** Build a typed Claude API service with auth, streaming, retry logic, and structured response parsing
**Demo:** After this: App sends a prompt to Claude and streams the response in real-time

## Tasks
- [x] **T01: Built Express API proxy that securely passes requests to Anthropic Claude API with SSE streaming support** — 1. Create a `server/` directory for the API proxy
2. Set up a minimal Express server with TypeScript
3. Create POST /api/claude/messages endpoint that proxies to Anthropic API
4. Load ANTHROPIC_API_KEY from .env
5. Support streaming responses (SSE passthrough)
6. Add CORS headers for local dev
7. Add request validation (reject empty prompts)
8. Add basic error handling (API errors, network timeouts)
9. Create server/package.json with express, cors, dotenv deps
10. Add npm script to start the proxy
  - Estimate: 25min
  - Files: server/index.ts, server/package.json, server/tsconfig.json, .env.example
  - Verify: Start proxy server, send a test curl to POST /api/claude/messages with a simple prompt, receive streamed response.
- [x] **T02: Built typed Claude API client with streaming, retry logic, JSON parsing, and yoga-specific helpers (generateSequence, suggestTransitions, generateCues)** — 1. Create `services/claude.ts` with typed ClaudeService
2. Define types: ClaudeMessage, ClaudeRequest, ClaudeResponse, StreamChunk
3. Implement sendMessage() that posts to the proxy and handles SSE streaming
4. Implement sendMessageSync() for non-streaming requests
5. Add retry logic with exponential backoff (3 attempts)
6. Add timeout handling (30 second default)
7. Add structured response parsing — extract JSON from Claude's response
8. Create yoga-specific system prompt templates in services/prompts.ts
9. Export typed helper: generateSequence(), suggestTransitions(), generateCues()
10. Add observability: log latency, token usage, errors
  - Estimate: 30min
  - Files: services/claude.ts, services/prompts.ts, services/types.ts, services/index.ts
  - Verify: Run `npx tsc --noEmit` — zero type errors. Integration test: call generateSequence() from a test screen and verify structured response.
- [x] **T03: Verified end-to-end Claude AI integration — Builder screen generates complete yoga sequence with streaming, teaching cues, and transitions** — 1. Create a temporary test screen or update Builder tab to call Claude API
2. Add a button that triggers generateSequence() with test params
3. Display streaming response in real-time
4. Verify error handling: test with invalid API key, network timeout simulation
5. Verify retry logic triggers on transient failures
6. Clean up and git commit
  - Estimate: 20min
  - Files: app/(tabs)/builder.tsx
  - Verify: Press 'Generate' button, see Claude response stream in. Test with proxy stopped — see error message. Run `npx tsc --noEmit`.
