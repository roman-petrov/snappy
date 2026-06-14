import type { AiModelCapabilities } from "../Types";
import type { AiModelEntry } from "./Entry";

import { Matches } from "./Matches";
import { ModelDefault } from "./ModelDefault";

export const ModelEmbedder = ({
  capabilities,
  name,
}: {
  capabilities: AiModelCapabilities;
  name: string;
}): AiModelEntry => ({
  capabilities,
  matches: Matches.name(name),
  name,
  source: `ai-tunnel`,
  type: `embedder`,
  ...ModelDefault,
});
