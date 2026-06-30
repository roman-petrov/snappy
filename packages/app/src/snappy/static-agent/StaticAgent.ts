/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/try-complexity */
import type { Locale } from "@snappy/intl";
import type {
  AgentAiModels,
  AgentEntry,
  AgentFeedRuntime,
  AgentGroupId,
  StaticFormAnswersOfFields,
  StaticFormField,
  StaticFormPlanOf,
} from "@snappy/snappy";

export type StaticAgentMetaCreateInput<TLocalization extends Localization> = {
  i18n: (key: keyof TLocalization) => string;
};

export type StaticAgentMetaPayload<TFields extends readonly StaticFormField[]> = {
  description: string;
  emoji: string;
  group: AgentGroupId;
  plan: StaticFormPlanOf<TFields> & { title: string };
  prompt: string;
};

export type StaticAgentRunInput<TFields extends readonly StaticFormField[] = readonly StaticFormField[]> = {
  answers: StaticFormAnswersOfFields<TFields>;
  feed: AgentFeedRuntime;
  isStopped: () => boolean;
  locale: Locale;
  models: AgentAiModels;
  plan: StaticFormPlanOf<TFields> & { title: string };
  prompt: string;
};

type Localization = Record<string, readonly [string, string]>;

export const StaticAgent =
  <TLocalization extends Localization, const TFields extends readonly StaticFormField[]>(
    localizationFactory: () => TLocalization,
    create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload<TFields>,
    run: (input: StaticAgentRunInput<TFields>) => Promise<unknown>,
  ): AgentEntry =>
  locale => {
    const localization = localizationFactory();

    const i18n = (key: keyof TLocalization) => {
      const value = localization[key];
      if (value === undefined) {
        return ``;
      }

      const [en, ru] = value;

      return locale === `ru` ? ru : en;
    };

    const { plan, prompt, ...meta } = create({ i18n });

    return {
      meta: { ...meta, title: plan.title },
      module: ({ aiConfig, feed, onRunningChange }) => {
        let stopped = false;
        const isStopped = () => stopped;

        return {
          run: async () => {
            stopped = false;
            onRunningChange?.(true);
            try {
              const answers = await feed.ask({ fields: plan.fields });
              if (isStopped()) {
                return;
              }
              await run({ answers, feed, isStopped, locale, models: aiConfig.models, plan, prompt });
            } finally {
              onRunningChange?.(false);
            }
          },
          stop: () => (stopped = true),
        };
      },
    };
  };
