export {
  sendMessage,
  sendMessageStreaming,
  generateSequence,
  suggestTransitions,
  generateCues,
  configureClaudeService,
  ClaudeAPIError,
} from './claude';

export type {
  ClaudeMessage,
  ClaudeRequest,
  ClaudeResponse,
  ClaudeServiceConfig,
  GeneratedSequence,
  GeneratedPose,
  SequenceGenerationParams,
  StreamEvent,
} from './types';
