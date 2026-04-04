/**
 * Claude API types for the client service.
 */

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequest {
  messages: ClaudeMessage[];
  system?: string;
  model?: string;
  max_tokens?: number;
  stream?: boolean;
}

export interface ClaudeResponse {
  id: string;
  model: string;
  content: Array<{ type: string; text: string }>;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface StreamEvent {
  type: string;
  delta?: {
    type: string;
    text?: string;
  };
  content_block?: {
    type: string;
    text: string;
  };
  message?: ClaudeResponse;
  usage?: {
    output_tokens: number;
  };
}

/** Parameters for generating a yoga sequence */
export interface SequenceGenerationParams {
  style: string;
  durationMinutes: number;
  difficulty: string;
  focusAreas: string[];
  intention?: string;
  experience?: string;
}

/** A generated pose within a sequence (from AI) */
export interface GeneratedPose {
  englishName: string;
  sanskritName: string;
  holdBreaths: number;
  side: 'left' | 'right' | 'both' | 'none';
  teachingCues: string[];
  transitionNote: string;
}

/** A complete generated sequence (from AI) */
export interface GeneratedSequence {
  name: string;
  style: string;
  durationMinutes: number;
  difficulty: string;
  focusAreas: string[];
  intention: string;
  warmUp: GeneratedPose[];
  mainSequence: GeneratedPose[];
  coolDown: GeneratedPose[];
  closingNotes: string;
}

export interface ClaudeServiceConfig {
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
}
