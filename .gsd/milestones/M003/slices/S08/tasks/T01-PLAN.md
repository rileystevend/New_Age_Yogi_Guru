---
estimated_steps: 11
estimated_files: 2
skills_used: []
---

# T01: Chat Screen with Message UI and Claude Integration

1. Add a Chat tab to the tab navigator (5th tab with message icon)
2. Build chat screen with message bubbles (user right, assistant left)
3. Text input with send button at bottom
4. Integrate with sendMessageStreaming() for real-time responses
5. Use YOGA_TEACHER_SYSTEM_PROMPT for context
6. Maintain conversation history in state (messages array)
7. Auto-scroll to bottom on new messages
8. Show typing indicator while streaming
9. Handle errors gracefully with retry option
10. Limit conversation to last 20 messages to manage tokens
11. Git commit

## Inputs

- `services/claude.ts — sendMessageStreaming from S04`
- `services/prompts.ts — YOGA_TEACHER_SYSTEM_PROMPT from S04`

## Expected Output

- `app/(tabs)/chat.tsx — Chat screen with message UI and AI integration`
- `app/(tabs)/_layout.tsx — Updated with 5th Chat tab`

## Verification

Run `npx tsc --noEmit`. Launch app, send a yoga teaching question, receive streamed response. Verify conversation persists across messages.
