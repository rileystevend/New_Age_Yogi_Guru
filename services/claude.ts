import { Platform } from 'react-native';
import {
  ClaudeMessage,
  ClaudeRequest,
  ClaudeResponse,
  ClaudeServiceConfig,
  GeneratedSequence,
  SequenceGenerationParams,
  StreamEvent,
} from './types';
import {
  SEQUENCE_GENERATION_SYSTEM_PROMPT,
  TRANSITION_SYSTEM_PROMPT,
  CUE_GENERATION_SYSTEM_PROMPT,
  buildSequencePrompt,
} from './prompts';

/**
 * Default config — localhost proxy for dev.
 * In production, this would point to the deployed API proxy.
 */
const DEFAULT_CONFIG: ClaudeServiceConfig = {
  // Android emulator uses 10.0.2.2 for host localhost
  baseUrl: Platform.OS === 'android'
    ? 'http://10.0.2.2:3001'
    : 'http://localhost:3001',
  timeoutMs: 60_000,
  maxRetries: 3,
};

let config = { ...DEFAULT_CONFIG };

export function configureClaudeService(overrides: Partial<ClaudeServiceConfig>): void {
  config = { ...config, ...overrides };
}

/**
 * Send a non-streaming message to Claude via the proxy.
 */
export async function sendMessage(
  messages: ClaudeMessage[],
  system?: string,
  maxTokens = 4096
): Promise<ClaudeResponse> {
  const request: ClaudeRequest = {
    messages,
    system,
    max_tokens: maxTokens,
    stream: false,
  };

  return executeWithRetry(async () => {
    const startTime = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const res = await fetch(`${config.baseUrl}/api/claude/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new ClaudeAPIError(
          `API error ${res.status}: ${errorBody}`,
          res.status,
          isRetryable(res.status)
        );
      }

      const data = (await res.json()) as ClaudeResponse;
      const elapsed = Date.now() - startTime;
      console.log(
        `[Claude] Sync response in ${elapsed}ms — ${data.usage.input_tokens}in/${data.usage.output_tokens}out tokens`
      );
      return data;
    } finally {
      clearTimeout(timeout);
    }
  });
}

/**
 * Send a streaming message to Claude via the proxy.
 * Calls onChunk with each text delta as it arrives.
 * Returns the full assembled text when complete.
 */
export async function sendMessageStreaming(
  messages: ClaudeMessage[],
  system: string | undefined,
  onChunk: (text: string) => void,
  maxTokens = 4096
): Promise<string> {
  const request: ClaudeRequest = {
    messages,
    system,
    max_tokens: maxTokens,
    stream: true,
  };

  return executeWithRetry(async () => {
    const startTime = Date.now();
    let fullText = '';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const res = await fetch(`${config.baseUrl}/api/claude/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new ClaudeAPIError(
          `API error ${res.status}: ${errorBody}`,
          res.status,
          isRetryable(res.status)
        );
      }

      if (!res.body) {
        throw new ClaudeAPIError('No response body for streaming', 0, false);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;

            try {
              const event = JSON.parse(jsonStr) as StreamEvent;
              if (
                event.type === 'content_block_delta' &&
                event.delta?.type === 'text_delta' &&
                event.delta.text
              ) {
                fullText += event.delta.text;
                onChunk(event.delta.text);
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      }

      const elapsed = Date.now() - startTime;
      console.log(`[Claude] Stream complete in ${elapsed}ms — ${fullText.length} chars`);
      return fullText;
    } finally {
      clearTimeout(timeout);
    }
  });
}

// ── Yoga-specific helpers ───────────────────────────────────

/**
 * Generate a full yoga class sequence.
 * Streams the response and parses the final JSON.
 */
export async function generateSequence(
  params: SequenceGenerationParams,
  onProgress?: (text: string) => void
): Promise<GeneratedSequence> {
  const prompt = buildSequencePrompt(params);
  const onChunk = onProgress ?? (() => {});

  const fullText = await sendMessageStreaming(
    [{ role: 'user', content: prompt }],
    SEQUENCE_GENERATION_SYSTEM_PROMPT,
    onChunk
  );

  return parseJSON<GeneratedSequence>(fullText, 'sequence');
}

/**
 * Suggest transitions between two poses.
 */
export async function suggestTransitions(
  fromPose: string,
  toPose: string
): Promise<Array<{ instruction: string; safetyNote: string | null; breathCue: string }>> {
  const response = await sendMessage(
    [
      {
        role: 'user',
        content: `Suggest a safe, smooth transition from ${fromPose} to ${toPose}. Include 2-4 transition steps.`,
      },
    ],
    TRANSITION_SYSTEM_PROMPT,
    1024
  );

  const text = response.content[0]?.text ?? '';
  return parseJSON(text, 'transitions');
}

/**
 * Generate teaching cues for a specific pose.
 */
export async function generateCues(
  poseName: string,
  context?: string
): Promise<{
  alignment: string[];
  breath: string[];
  imagery: string[];
  modification: string[];
  deepening: string[];
}> {
  const prompt = context
    ? `Generate teaching cues for ${poseName} in the context of: ${context}`
    : `Generate teaching cues for ${poseName}`;

  const response = await sendMessage(
    [{ role: 'user', content: prompt }],
    CUE_GENERATION_SYSTEM_PROMPT,
    1024
  );

  const text = response.content[0]?.text ?? '';
  return parseJSON(text, 'cues');
}

// ── Retry logic ─────────────────────────────────────────────

async function executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (err instanceof ClaudeAPIError && !err.retryable) {
        throw err;
      }

      if (attempt < config.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(
          `[Claude] Retry ${attempt}/${config.maxRetries} after ${delay}ms — ${lastError.message}`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error('All retries exhausted');
}

function isRetryable(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── JSON parsing ────────────────────────────────────────────

function parseJSON<T>(text: string, label: string): T {
  // Try direct parse first
  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T;
      } catch {
        // fall through
      }
    }

    // Try to find JSON object or array in the text
    const objectMatch = text.match(/(\{[\s\S]*\})/);
    const arrayMatch = text.match(/(\[[\s\S]*\])/);
    const match = objectMatch ?? arrayMatch;

    if (match) {
      try {
        return JSON.parse(match[1]) as T;
      } catch {
        // fall through
      }
    }

    throw new ClaudeAPIError(
      `Failed to parse ${label} JSON from Claude response: ${text.slice(0, 200)}...`,
      0,
      false
    );
  }
}

// ── Error class ─────────────────────────────────────────────

export class ClaudeAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable: boolean
  ) {
    super(message);
    this.name = 'ClaudeAPIError';
  }
}
