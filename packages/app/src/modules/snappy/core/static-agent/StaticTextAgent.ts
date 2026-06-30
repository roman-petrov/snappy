import type { StaticFormField } from "@snappy/snappy";

import { StaticAgent, type StaticAgentMetaCreateInput, type StaticAgentMetaPayload } from "./StaticAgent";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

type Localization = Record<string, readonly [string, string]>;

export const StaticTextAgent = <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
  localizationFactory: () => TLocalization,
  create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
) =>
  StaticAgent(localizationFactory, create, async ({ answers, feed, models, plan, prompt }) =>
    feed.generateText({ model: models.chat, prompt: StaticAgentPrompt({ answers, mainPrompt: prompt, plan }) }),
  );
