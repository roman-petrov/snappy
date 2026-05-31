/* eslint-disable functional/no-expression-statements */
import type { AiModel } from "./AiModel";

export const AiModelDeepSeek: AiModel = {
  assistantReasoningExtras: reasoning => ({ reasoningContent: reasoning }),
  assistantToolCallsExtras: message => ({ reasoning_content: message.reasoningContent ?? `` }),
  completionExtras: reasoning => (reasoning.effort === `none` ? { thinking: { type: `disabled` as const } } : {}),
  matches: model => model.startsWith(`deepseek-`),
  streamDelta: (delta, sink) => {
    if (sink.pushPlainReasoning(delta.reasoning)) {
      return;
    }
    sink.pushDetailsReasoning(delta.reasoningDetails);
  },
};
