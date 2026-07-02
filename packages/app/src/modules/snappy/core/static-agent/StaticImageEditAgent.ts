/* eslint-disable functional/no-expression-statements */
import type { Bilingual } from "@snappy/intl";
import type { AgentImageEdit, StaticFormField } from "@snappy/snappy";

import {
  StaticAgent,
  type StaticAgentMetaCreateInput,
  type StaticAgentMetaPayload,
  type StaticAgentRunInput,
} from "./StaticAgent";

type Localization = Record<string, Bilingual>;

export const StaticImageEditAgent = <
  TLocalization extends Localization,
  const TFields extends readonly StaticFormField[],
>(
  localizationFactory: () => TLocalization,
  create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
  resolve: (input: StaticAgentRunInput<TFields>) => AgentImageEdit | undefined,
  prompt?: (input: StaticAgentRunInput<TFields>) => string | undefined,
) =>
  StaticAgent(localizationFactory, create, async input => {
    const { feed, isStopped, locale, models } = input;
    const edit = resolve(input);
    if (edit === undefined || isStopped()) {
      return;
    }

    await feed.generateImage({
      edit,
      locale,
      model: models.image,
      prompt: prompt?.(input) ?? input.prompt,
    });
  });
