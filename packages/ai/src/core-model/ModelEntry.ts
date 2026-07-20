import type { AiHttpConfig } from "../AiHttp";
import type { AiModelCapabilities, AiModelCost, AiModelType } from "../Types";
import type { AiModelBehavior, AiModelEntry } from "./Entry";

import { Matches } from "./Matches";
import { ModelDefault } from "./ModelDefault";

type EntryProps = {
  behavior?: Partial<AiModelBehavior>;
  capabilities: AiModelCapabilities;
  cost?: AiModelCost;
  name: string;
};

const bind = <Type extends AiModelType, Bound>(
  type: Type,
  { behavior, capabilities, cost, name }: EntryProps,
  api: (http: AiHttpConfig, catalog: AiModelEntry & { type: Type }) => Bound,
) => {
  const catalog: AiModelEntry & { type: Type } = {
    capabilities,
    ...(cost === undefined ? {} : { cost }),
    matches: Matches.name(name),
    name,
    source: `ai-tunnel`,
    type,
    ...ModelDefault,
    ...behavior,
  };

  return { ...catalog, of: (http: AiHttpConfig) => api(http, catalog) };
};

export const ModelEntry = { bind };
