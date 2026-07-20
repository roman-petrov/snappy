import type { AiHttpConfig } from "../AiHttp";
import type { AiChatCompletionSession, AiChatCompletionsInput, AiModelCapabilities, AiModelCost } from "../Types";
import type { AiModelBehavior, AiModelEntry } from "./Entry";

import { AiChat } from "../AiChat";
import { ModelEntry } from "./ModelEntry";

export type AiChatModel = CatalogChat & { completions: (input: AiChatCompletionsInput) => AiChatCompletionSession };

export type CatalogChat = AiModelEntry & { type: `chat` };

export const ModelChat = ({
  behavior,
  capabilities,
  cost,
  name,
}: {
  behavior?: Partial<AiModelBehavior>;
  capabilities: AiModelCapabilities;
  cost: AiModelCost;
  name: string;
}): CatalogChat & { of: (http: AiHttpConfig) => AiChatModel } =>
  ModelEntry.bind(`chat`, { behavior, capabilities, cost, name }, (http, catalog) => ({
    ...catalog,
    completions: input => AiChat.completion(http, catalog, input),
  }));
