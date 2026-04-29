/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Locale } from "@snappy/intl";
import type { AgentAiConfig, AgentFeedRuntime } from "@snappy/snappy-sdk";

import { Agent as AgentRuntime, type AgentStreamPart } from "@snappy/agent";
import { Ai, type AiChatMessage } from "@snappy/ai";
import { _ } from "@snappy/core";

import { System } from "./System";
import tools from "./tools/index";

export type SnappyAgentConfig = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  locale: Locale;
  onRunningChange?: (running: boolean) => void;
};

export const SnappyAgent = ({ aiConfig, feed, locale, onRunningChange }: SnappyAgentConfig) => {
  let stopped = false;
  let stopRun: (() => void) | undefined;

  return {
    run: async (firstUserMessage: string, registerAppendUser: (append: (text: string) => void) => void) => {
      stopped = false;
      onRunningChange?.(true);
      try {
        const text = firstUserMessage.trim();
        if (text === ``) {
          return;
        }
        const initialMessages: AiChatMessage[] = [{ content: text, role: `user` }];
        const aiClient = await Ai({ ...aiConfig.options });

        const agent = AgentRuntime({
          ai: aiClient,
          chatModel: aiConfig.models.chat,
          idleAfterSuccess: true,
          locale,
          maxRounds: 32,
          systemPrompt: System.prompt(locale),
          tools: {
            snappy: _.fromEntries(
              _.entries(tools).map(([toolId, tool]) => [
                toolId,
                tool({ ai: aiClient, config: aiConfig, feed, isStopped: () => stopped, locale }),
              ]),
            ),
          },
        });

        const runInstance = agent.start(initialMessages);
        stopRun = runInstance.stop;
        registerAppendUser(text => runInstance.appendUserText(text));

        const handleStreamPart = (part: AgentStreamPart) => {
          switch (part.type) {
            case `model_stream`: {
              if (part.variant === `reasoning`) {
                feed.appendReasoningStream(part.stream);
              } else {
                feed.appendChatStream(part.stream);
              }
              break;
            }
            case `run`: {
              break;
            }
            case `thinking`: {
              feed.appendStatus(part.label, part.finished);
              break;
            }
            case `tool`: {
              if (part.label.trim() !== ``) {
                feed.appendToolBadge(part.label, part.finished);
              }
              break;
            }
            // No default
          }
        };

        for await (const part of runInstance) {
          if (stopped) {
            break;
          }
          handleStreamPart(part);
        }
        await runInstance.done;
      } catch {
        /* Aborted */
      } finally {
        stopRun = undefined;
        onRunningChange?.(false);
      }
    },
    stop: () => {
      stopped = true;
      stopRun?.();
    },
  };
};
