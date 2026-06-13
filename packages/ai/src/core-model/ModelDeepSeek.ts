/* eslint-disable functional/no-expression-statements */
import type { AiModelBehavior } from "./Entry";

import { ModelDefault } from "./ModelDefault";

export const ModelDeepSeek: AiModelBehavior = {
  ...ModelDefault,
  assistantReasoningExtras: reasoning => ({ reasoningContent: reasoning }),
  assistantToolCallsExtras: message => ({ reasoning_content: message.reasoningContent ?? `` }),
  streamDelta: (delta, sink) => {
    if (sink.pushPlainReasoning(delta.reasoning)) {
      return;
    }
    sink.pushDetailsReasoning(delta.reasoningDetails);
  },
};
