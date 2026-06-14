import type { AiModelCapabilities } from "../Types";
import type { AiModelBehavior, AiModelEntry } from "./Entry";

import { Matches } from "./Matches";
import { ModelDefault } from "./ModelDefault";

export const ModelChat = ({
  behavior = ModelDefault,
  capabilities,
  name,
}: {
  behavior?: AiModelBehavior;
  capabilities: AiModelCapabilities;
  name: string;
}): AiModelEntry => ({
  capabilities,
  matches: Matches.name(name),
  name,
  source: `ai-tunnel`,
  type: `chat`,
  ...behavior,
});
