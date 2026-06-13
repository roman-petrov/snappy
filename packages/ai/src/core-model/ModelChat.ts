import type { AiHttpConfig } from "../AiHttp";
import type { AiChatCompletionSession, AiChatCompletionsInput, AiModelCapabilities } from "../Types";
import type { AiModelEntry } from "./Entry";

import { AiChat } from "../AiChat";
import { ModelEntry } from "./ModelEntry";

export type AiChatModel = CatalogChat & { completions: (input: AiChatCompletionsInput) => AiChatCompletionSession };

export type CatalogChat = AiModelEntry & { type: `chat` };

export const ModelChat = ({
  behavior,
  capabilities,
  name,
}: {
  behavior?: Pick<AiModelEntry, `assistantReasoningExtras` | `assistantToolCallsExtras` | `streamDelta`>;
  capabilities: AiModelCapabilities;
  name: string;
}): CatalogChat & { of: (http: AiHttpConfig) => AiChatModel } =>
  ModelEntry.bind(`chat`, { behavior, capabilities, name }, (http, catalog) => ({
    ...catalog,
    completions: input => AiChat.completion(http, catalog, input),
  }));
