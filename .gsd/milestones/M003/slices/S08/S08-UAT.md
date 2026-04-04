# S08: AI Chat — Yoga Teaching Q&A — UAT

**Milestone:** M003
**Written:** 2026-04-04T22:19:40.826Z

## UAT: AI Chat — Yoga Teaching Q&A

### Pre-conditions
- Proxy running, Expo running, ANTHROPIC_API_KEY set

### Test Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Empty state | Navigate to Chat tab | 🧘 icon, title, description, 3 suggested questions |
| 2 | Suggested question | Tap a suggested question | Text populates input field |
| 3 | Send message | Type question, tap send | User bubble appears, streaming assistant response begins |
| 4 | Streaming | Watch response | Text appears incrementally with cursor indicator |
| 5 | Conversation | Send follow-up question | Response considers previous context |
| 6 | Input disabled | During streaming | Send button greyed, input not editable |
| 7 | Error | Stop proxy, send message | Error bar with message |

