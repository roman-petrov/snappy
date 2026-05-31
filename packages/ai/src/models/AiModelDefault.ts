/* eslint-disable functional/no-expression-statements */
import type { AiModel } from "./AiModel";

export const AiModelDefault: AiModel = {
  assistantReasoningExtras: reasoning => (reasoning === `` ? {} : { reasoningContent: reasoning }),
  assistantToolCallsExtras: () => ({}),
  completionExtras: () => ({}),
  matches: () => false,
  streamDelta: (delta, { pushPlainReasoning }) => {
    pushPlainReasoning(delta.reasoning);
  },
};
