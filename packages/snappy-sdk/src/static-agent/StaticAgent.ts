/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import { AiConstants } from "@snappy/ai";

import type { StaticFormPlan } from "../Schema";
import type { AgentAiConfig, AgentEntry, AgentFeedRuntime, AgentGroupId } from "../Types";

export type StaticAgentMetaParameters = { maxImagePromptLength: number; maxSpeechFileMegaBytes: number };

type Localization = Record<string, readonly [string, string]>;

type StaticAgentMetaCreateInput<TLocalization extends Localization> = {
  i18n: (key: keyof TLocalization) => string;
  parameters: StaticAgentMetaParameters;
};

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
  parameters: StaticAgentMetaParameters;
  plan: StaticFormPlan;
  prompt: string;
};

export const StaticAgent =
  (run: StaticAgentRun) =>
  <TLocalization extends Localization>(
    localizationFactory: (parameters: StaticAgentMetaParameters) => TLocalization,
    create: (input: StaticAgentMetaCreateInput<TLocalization>) => StaticAgentMetaPayload,
  ): AgentEntry =>
  locale => {
    const parameters: StaticAgentMetaParameters = {
      maxImagePromptLength: AiConstants.maxImagePromptLength,
      maxSpeechFileMegaBytes: AiConstants.maxSpeechFileMegaBytes,
    };

    const localization = localizationFactory(parameters);

    const i18n = (key: keyof TLocalization) => {
      const value = localization[key];
      if (value === undefined) {
        return ``;
      }

      const [en, ru] = value;

      return locale === `ru` ? ru : en;
    };

    const { plan, prompt, ...meta } = create({ i18n, parameters });

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
              await run({ aiConfig, feed, isStopped, locale, parameters, plan, prompt });
            } finally {
              onRunningChange?.(false);
            }
          },
          stop: () => (stopped = true),
        };
      },
    };
  };
