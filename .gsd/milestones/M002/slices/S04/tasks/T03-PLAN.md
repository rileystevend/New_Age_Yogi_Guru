---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T03: Test Screen + End-to-End Verification + Git Commit

1. Create a temporary test screen or update Builder tab to call Claude API
2. Add a button that triggers generateSequence() with test params
3. Display streaming response in real-time
4. Verify error handling: test with invalid API key, network timeout simulation
5. Verify retry logic triggers on transient failures
6. Clean up and git commit

## Inputs

- `services/claude.ts — Claude client from T02`
- `server/index.ts — Proxy from T01`

## Expected Output

- `app/(tabs)/builder.tsx — Builder screen with working AI generation test`

## Verification

Press 'Generate' button, see Claude response stream in. Test with proxy stopped — see error message. Run `npx tsc --noEmit`.
