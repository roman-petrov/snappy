/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";
import type { AgentAiConfig, AgentFeedRuntime } from "@snappy/snappy-sdk";

import { Agent } from "@snappy/agent";
import { Ai } from "@snappy/ai";
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

  const run = async (content: string) => {
    feed.appendUserText(content);
    for await (const part of agent.start([{ content, role: `user` }])) {
      if (agent.context.isStopped()) {
        break;
      }
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
    }
  };

  const appendUserText = (text: string) => {
    feed.appendUserText(text);
    agent.appendUserText(text);
  };

  return { ...agent, appendUserText, run };
};

export type SnappyAgent = ReturnType<typeof SnappyAgent>;
