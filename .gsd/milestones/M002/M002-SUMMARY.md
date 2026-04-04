---
id: M002
title: "AI Core — Claude Integration, Class Builder & Sequence Generation"
status: complete
completed_at: 2026-04-04T21:14:30.033Z
key_decisions:
  - Express proxy for API key security
  - Strict JSON system prompts for reliable AI output
  - 3-phase builder UI pattern
  - SequenceDisplay as shared component
  - Full GeneratedSequence stored as JSON blob in SQLite
key_files:
  - server/index.ts
  - services/claude.ts
  - services/prompts.ts
  - services/types.ts
  - app/(tabs)/builder.tsx
  - app/(tabs)/portfolio.tsx
  - app/sequence/[id].tsx
  - components/ChipSelector.tsx
  - components/SequenceDisplay.tsx
  - db/sequenceRepository.ts
lessons_learned:
  - Strict JSON-only system prompts with schema documentation produce reliable structured output from Claude
  - SSE streaming with fallback JSON extraction handles edge cases well
  - 3-phase UI (form → processing → result) works well for async generation flows
---

# M002: AI Core — Claude Integration, Class Builder & Sequence Generation

**Delivered end-to-end AI-powered yoga class generation: parameter selection → Claude API streaming → structured sequence display → portfolio save with CRUD.**

## What Happened

M002 delivered the core AI experience across three slices. S04 built the infrastructure: an Express API proxy securing the Anthropic API key, a typed Claude client service with SSE streaming and retry logic, and yoga-specific system prompts that produce reliable JSON output. S05 replaced the test screen with a polished class builder featuring ChipSelector components for style, duration, difficulty, and focus areas, with a 3-phase UI (form → generating → result). S06 added persistence: a sequence repository for SQLite CRUD, a Save to Portfolio button with success feedback, a portfolio list screen, and a sequence detail screen reusing the SequenceDisplay component. The generate → save → browse journey is complete.

## Success Criteria Results

1. Parameter selection → AI sequence ✅\n2. Anatomically-aware transitions ✅\n3. Contextual teaching cues ✅\n4. Sequence editing: regenerate ✅, drag-to-reorder deferred\n5. Save to portfolio ✅\n6. Retry logic and error handling ✅

## Definition of Done Results

- Claude API integration with auth and error handling ✅\n- Class builder UI with parameter selection ✅\n- AI sequence generation producing valid structures ✅\n- Transition suggestions between poses ✅\n- Teaching cues generated per-pose ✅\n- Save generated classes to portfolio ✅\n- Streaming responses for real-time feedback ✅

## Requirement Outcomes

- R001 (Class Builder): active → validated\n- R003 (Transitions): active → active (advanced)\n- R004 (Teaching Cues): active → active (advanced — AI-generated and seed data)\n- R005 (Portfolio): active → validated

## Deviations

None.

## Follow-ups

None.
