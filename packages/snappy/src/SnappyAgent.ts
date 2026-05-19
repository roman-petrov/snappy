/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Locale } from "@snappy/intl";
import type { AgentAiConfig, AgentFeedRuntime } from "@snappy/snappy-sdk";

import { Agent, type AgentStreamPart } from "@snappy/agent";
import { Ai, type AiChatMessage } from "@snappy/ai";
import { _ } from "@snappy/core";

import { System } from "./System";
import tools from "./tools/index";

export type SnappyAgentConfig = { aiConfig: AgentAiConfig; feed: AgentFeedRuntime; locale: Locale };

export const SnappyAgent = ({ aiConfig, feed, locale }: SnappyAgentConfig) => {
  const aiClient = Ai(aiConfig.options);

  const agent = Agent({
    ai: aiClient,
    chatModel: aiConfig.models.chat,
    idleAfterSuccess: true,
    locale,
    maxRounds: 32,
    systemPrompt: System.prompt(locale),
    tools: ({ isStopped }) => ({
      snappy: _.fromEntries(
        _.entries(tools).map(([toolId, tool]) => [
          toolId,
          tool({ ai: aiClient, config: aiConfig, feed, isStopped, locale }),
        ]),
      ),
    }),
  });

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

  const run = async (firstUserMessage: string) => {
    try {
      const text = firstUserMessage.trim();
      if (text === ``) {
        return;
      }
      const initialMessages: AiChatMessage[] = [{ content: text, role: `user` }];
      const runInstance = agent.start(initialMessages);

      for await (const part of runInstance) {
        if (agent.context.isStopped()) {
          break;
        }
        handleStreamPart(part);
      }
      await runInstance.done;
    } catch {
      /* Aborted */
    }
  };

  return { ...agent, run };
};

export type SnappyAgent = ReturnType<typeof SnappyAgent>;
