---
estimated_steps: 10
estimated_files: 4
skills_used: []
---

# T01: Lightweight Express API Proxy for Claude

1. Create a `server/` directory for the API proxy
2. Set up a minimal Express server with TypeScript
3. Create POST /api/claude/messages endpoint that proxies to Anthropic API
4. Load ANTHROPIC_API_KEY from .env
5. Support streaming responses (SSE passthrough)
6. Add CORS headers for local dev
7. Add request validation (reject empty prompts)
8. Add basic error handling (API errors, network timeouts)
9. Create server/package.json with express, cors, dotenv deps
10. Add npm script to start the proxy

## Inputs

- `.env — ANTHROPIC_API_KEY`

## Expected Output

- `server/index.ts — Express proxy with Claude API passthrough`
- `server/package.json — Server dependencies`
- `server/tsconfig.json — Server TypeScript config`
- `.env.example — Template for required env vars`

## Verification

Start proxy server, send a test curl to POST /api/claude/messages with a simple prompt, receive streamed response.
