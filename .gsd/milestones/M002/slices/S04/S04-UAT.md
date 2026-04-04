# S04: Claude API Service Layer + Streaming — UAT

**Milestone:** M002
**Written:** 2026-04-04T21:03:16.076Z

## UAT: Claude API Service Layer + Streaming

### Pre-conditions
- ANTHROPIC_API_KEY set in .env
- Proxy running: `cd server && npm run dev`
- Expo running: `npx expo start`

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Proxy health | GET http://localhost:3001/api/health | Returns {status: 'ok'} |
| 2 | Non-streaming | POST to proxy with stream:false | Returns complete JSON response |
| 3 | Streaming | POST to proxy with stream:true | Returns SSE event stream |
| 4 | Generate sequence | Tap 'Generate Sequence' in Builder tab | Streaming text appears, then parsed sequence with sections |
| 5 | Warm-up section | Check generated sequence | 3-5 warm-up poses with cues |
| 6 | Main sequence | Check generated sequence | 5-10 main poses with bilateral handling |
| 7 | Cool-down section | Check generated sequence | 3-5 cool-down poses ending in Savasana |
| 8 | Teaching cues | Check any generated pose | 2-3 specific, natural teaching cues |
| 9 | Transitions | Check transition notes | Smooth, safe transitions between poses |
| 10 | Error handling | Stop proxy, tap Generate | Error message displayed, no crash |
| 11 | TypeScript | Run `npx tsc --noEmit` | Zero type errors |

