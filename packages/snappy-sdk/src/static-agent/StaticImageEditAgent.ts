/* eslint-disable functional/no-expression-statements */
import type { StaticFormField } from "../Schema";
import type { AgentImageEdit } from "../Types";

import {
  StaticAgent,
  type StaticAgentMetaCreateInput,
  type StaticAgentMetaPayload,
  type StaticAgentRunInput,
} from "./StaticAgent";

type Localization = Record<string, readonly [string, string]>;

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
    const edit = resolve(input);
    if (edit === undefined || input.isStopped()) {
      return;
    }

    await input.feed.generateImage({ edit, model: input.models.image, prompt: prompt?.(input) ?? input.prompt });
  });
