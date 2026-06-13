/* eslint-disable functional/no-expression-statements */
import type { AiModelBehavior } from "./Entry";

export const ModelDefault: AiModelBehavior = {
  assistantReasoningExtras: reasoning => (reasoning === `` ? {} : { reasoningContent: reasoning }),
  assistantToolCallsExtras: () => ({}),
  streamDelta: (delta, { pushPlainReasoning }) => {
    pushPlainReasoning(delta.reasoning);
  },
};
