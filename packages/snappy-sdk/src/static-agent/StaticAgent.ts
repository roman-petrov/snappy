/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import type { StaticFormPlan } from "../Schema";
import type { AgentAiConfig, AgentEntry, AgentFeedRuntime, AgentGroupId } from "../Types";

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

type StaticAgentRun = (input: StaticAgentRunInput) => Promise<void>;

type StaticAgentRunInput = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  isStopped: () => boolean;
  locale: Locale;
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
        let stopped = false;
        const isStopped = () => stopped;

        return {
          run: async () => {
            stopped = false;
            onRunningChange?.(true);
            try {
              await run({ aiConfig, feed, isStopped, locale, plan, prompt });
            } finally {
              onRunningChange?.(false);
            }
          },
          stop: () => (stopped = true),
        };
      },
    };
  };
