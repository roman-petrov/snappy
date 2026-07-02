import type { Bilingual } from "@snappy/intl";
import type { StaticFormField } from "@snappy/snappy";

import { StaticAgent, type StaticAgentMetaCreateInput, type StaticAgentMetaPayload } from "./StaticAgent";
import { StaticAgentPrompt } from "./StaticAgentPrompt";

type Localization = Record<string, Bilingual>;

export const StaticTextAgent = <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
  localizationFactory: () => TLocalization,
  create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
) =>
  StaticAgent(localizationFactory, create, async ({ answers, feed, locale, models, plan, prompt }) =>
    feed.generateText({
      locale,
      model: models.chat,
      prompt: StaticAgentPrompt({ answers, locale, mainPrompt: prompt, plan }),
    }),
  );
