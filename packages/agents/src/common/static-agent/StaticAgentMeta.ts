import type { AgentLocale } from "@snappy/agent";

import type { StaticFormPlan } from "../../core";
import type { AgentGroupId } from "../../Types";

export type StaticAgentMeta = (parameters: StaticAgentMetaParameters, locale: AgentLocale) => StaticAgentMetaPayload;

export type StaticAgentMetaCreateInput<TLocalization extends StaticAgentMetaLocalizationShape<TLocalization>> = {
  i18n: (key: keyof TLocalization) => string;
  parameters: StaticAgentMetaParameters;
};

export type StaticAgentMetaI18n<TLocalization extends StaticAgentMetaLocalizationShape<TLocalization>> = (
  key: keyof TLocalization,
) => string;

export type StaticAgentMetaLocaleTuple = readonly [emoji: string, en: string, ru: string];

export type StaticAgentMetaLocalizationFactory<TLocalization extends StaticAgentMetaLocalizationShape<TLocalization>> =
  (parameters: StaticAgentMetaParameters) => TLocalization;

export type StaticAgentMetaParameters = { maxImagePromptLength?: number; maxSpeechFileMegaBytes?: number };

export type StaticAgentMetaPayload = {
  description: string;
  emoji: string;
  group: AgentGroupId;
  plan: StaticFormPlan;
  prompt: string;
  title: string;
};

type StaticAgentMetaLocalizationShape<TLocalization> = {
  readonly [K in keyof TLocalization]: StaticAgentMetaLocaleTuple;
};

export const StaticAgentMeta =
  <TLocalization extends StaticAgentMetaLocalizationShape<TLocalization>>(
    localizationFactory: StaticAgentMetaLocalizationFactory<TLocalization>,
    create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload,
  ): StaticAgentMeta =>
  (parameters, locale) => {
    const localization = localizationFactory(parameters);

    const i18n: StaticAgentMetaI18n<TLocalization> = key => {
      const [emoji, en, ru] = localization[key];
      const text = locale === `ru` ? ru : en;

      return emoji === `` ? text : `${emoji} ${text}`;
    };

    return { ...create({ i18n, parameters }), localization };
  };
