import type { AiHttpConfig } from "../AiHttp";
import type { AiModelCapabilities, AiModelType } from "../Types";
import type { AiModelBehavior, AiModelEntry } from "./Entry";

import { Matches } from "./Matches";
import { ModelDefault } from "./ModelDefault";

type EntryProps = { behavior?: AiModelBehavior; capabilities: AiModelCapabilities; name: string };

const bind = <Type extends AiModelType, Bound>(
  type: Type,
  { behavior = ModelDefault, capabilities, name }: EntryProps,
  api: (http: AiHttpConfig, catalog: AiModelEntry & { type: Type }) => Bound,
) => {
  const catalog: AiModelEntry & { type: Type } = {
    capabilities,
    matches: Matches.name(name),
    name,
    source: `ai-tunnel`,
    type,
    ...behavior,
  };

  return { ...catalog, of: (http: AiHttpConfig) => api(http, catalog) };
};

export const ModelEntry = { bind };
