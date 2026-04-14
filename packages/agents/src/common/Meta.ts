import type { AgentLocale } from "@snappy/agent";

import type { StaticFormPlan } from "../core";
import type { AgentGroupId } from "../Types";

export type Meta = (parameters: MetaParameters, locale: AgentLocale) => MetaPayload;

export type MetaCreateInput<TLocalization extends MetaLocalizationShape<TLocalization>> = {
  i18n: (key: keyof TLocalization) => string;
  parameters: MetaParameters;
};

export type MetaI18n<TLocalization extends MetaLocalizationShape<TLocalization>> = (key: keyof TLocalization) => string;

export type MetaLocaleTuple = readonly [emoji: string, en: string, ru: string];

export type MetaLocalization = Record<string, MetaLocaleTuple>;

export type MetaLocalizationFactory<TLocalization extends MetaLocalizationShape<TLocalization>> = (
  parameters: MetaParameters,
) => TLocalization;

export type MetaParameters = { maxImagePromptLength?: number; maxSpeechFileMegaBytes?: number };

export type MetaPayload = {
  description: string;
  emoji: string;
  group: AgentGroupId;
  prompt: string;
  title: string;
  uiPlan: StaticFormPlan;
};

type MetaLocalizationShape<TLocalization> = { readonly [K in keyof TLocalization]: MetaLocaleTuple };

export const Meta =
  <TLocalization extends MetaLocalizationShape<TLocalization>>(
    localizationFactory: MetaLocalizationFactory<TLocalization>,
    create: (input: MetaCreateInput<TLocalization>) => MetaPayload,
  ): Meta =>
  (parameters, locale) => {
    const localization = localizationFactory(parameters);

    const i18n: MetaI18n<TLocalization> = key => {
      const [emoji, en, ru] = localization[key];
      const text = locale === `ru` ? ru : en;

      return emoji === `` ? text : `${emoji} ${text}`;
    };

    return { ...create({ i18n, parameters }), localization };
  };
