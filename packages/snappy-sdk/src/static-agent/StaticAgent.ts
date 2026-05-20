/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import { Ai } from "@snappy/ai";

import type { StaticFormAnswers, StaticFormPlan } from "../Schema";
import type { AgentAiModels, AgentEntry, AgentFeedRuntime, AgentGroupId } from "../Types";

type Localization = Record<string, readonly [string, string]>;

type StaticAgentMetaCreateInput<TLocalization extends Localization> = { i18n: (key: keyof TLocalization) => string };

type StaticAgentMetaPayload = {
  description: string;
  emoji: string;
  group: AgentGroupId;
  plan: StaticFormPlan;
  prompt: string;
  title: string;
};

type StaticAgentRun = (input: StaticAgentRunInput) => Promise<unknown>;

type StaticAgentRunInput = {
  ai: Ai;
  answers: StaticFormAnswers;
  feed: AgentFeedRuntime;
  isStopped: () => boolean;
  locale: Locale;
  models: AgentAiModels;
  plan: StaticFormPlan;
  prompt: string;
};

export const StaticAgent =
  (run: StaticAgentRun) =>
  <TLocalization extends Localization>(
    localizationFactory: () => TLocalization,
    create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload,
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
      meta,
      module: ({ aiConfig, feed, onRunningChange }) => {
        const ai = Ai(aiConfig.options);
        const { models } = aiConfig;
        let stopped = false;
        const isStopped = () => stopped;

        return {
          run: async () => {
            stopped = false;
            onRunningChange?.(true);
            try {
              const answers = await feed.ask(plan);
              if (isStopped()) {
                return;
              }
              await run({ ai, answers, feed, isStopped, locale, models, plan, prompt });
            } finally {
              onRunningChange?.(false);
            }
          },
          stop: () => (stopped = true),
        };
      },
    };
  };
