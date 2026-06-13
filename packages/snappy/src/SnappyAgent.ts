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
  const files: Record<string, File> = {};
  const media: Record<string, string> = {};

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
          tool({ ai: aiClient, config: aiConfig, feed, files, isStopped, locale, media }),
        ]),
      ),
    }),
  });

  const run = async (content: string) => {
    feed.appendUserText(content);
    const agentRun = agent.start([{ content, role: `user` }], {
      chatStream: async stream => feed.appendChatStream(stream),
      reasoningStream: async stream => feed.appendReasoningStream(stream),
      thinking: (label, done) => feed.appendStatus(label, done),
      tool: part => {
        if (part.label.trim() !== ``) {
          feed.appendToolBadge(part.label, part.done);
        }
      },
    });
    await agentRun.done;
  };

  const appendUserText = (text: string) => {
    feed.appendUserText(text);
    agent.appendUserText(text);
  };

  return { ...agent, appendUserText, run };
};

export type SnappyAgent = ReturnType<typeof SnappyAgent>;
