/* eslint-disable functional/no-expression-statements */
import type { AiModelBehavior } from "./Entry";

import { ModelDefault } from "./ModelDefault";

export const ModelDeepSeek: AiModelBehavior = {
  ...ModelDefault,
  assistantReasoningExtras: reasoning => ({ reasoningContent: reasoning }),
  assistantToolCallsExtras: message => ({ reasoning_content: message.reasoningContent ?? `` }),
  completionExtras: reasoning => (reasoning.effort === `none` ? { thinking: { type: `disabled` as const } } : {}),
  streamDelta: (delta, sink) => {
    if (sink.pushPlainReasoning(delta.reasoning)) {
      return;
    }
    sink.pushDetailsReasoning(delta.reasoningDetails);
  },
};
