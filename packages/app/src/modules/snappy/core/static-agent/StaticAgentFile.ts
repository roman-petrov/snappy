/* eslint-disable functional/no-expression-statements */
import type { Bilingual } from "@snappy/intl";
import type { StaticFormField } from "@snappy/snappy";

import {
  StaticAgent,
  type StaticAgentMetaCreateInput,
  type StaticAgentMetaPayload,
  type StaticAgentRunInput,
} from "./StaticAgent";

type Localization = Record<string, Bilingual>;

export const StaticAgentFile =
  (run: (input: StaticAgentRunInput, file: File) => Promise<unknown>) =>
  <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
    localizationFactory: () => TLocalization,
    create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
    resolve: (input: StaticAgentRunInput<TFields>) => File | undefined,
  ) =>
    StaticAgent(localizationFactory, create, async input => {
      const file = resolve(input);
      if (file === undefined || input.isStopped()) {
        return;
      }

      await run(input, file);
    });
