/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import { Agent } from "@snappy/agent";
import { _ } from "@snappy/core";
import { Skills } from "@snappy/snappy-skills";

import type { SnappyPreset } from "./preset";
import type { AgentAiConfig, AgentFeedRuntime } from "./Types";

import { Skill } from "./Skill";
import { System } from "./System";
import tools from "./tools/index";

export type SnappyAgentConfig = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  locale: Locale;
  preset?: SnappyPreset;
};

export const SnappyAgent = ({ aiConfig, feed, locale, preset }: SnappyAgentConfig) => {
  const skills = Skill.parse(Skills);
  const files: Record<string, File> = {};
  const media: Record<string, string> = {};
  const base = System.prompt(locale, preset === undefined);
  const skill = preset?.skill === undefined ? undefined : skills.find(entry => entry.id === preset.skill)?.content;
  const systemPrompt = skill === undefined ? base : [...base, [`skill_${preset?.skill ?? ``}`, skill] as const];

  const toolList =
    preset === undefined
      ? _.entries(tools)
      : preset.tools.flatMap(toolId => (tools[toolId] === undefined ? [] : [[toolId, tools[toolId]] as const]));

  const agent = Agent({
    chatModel: aiConfig.models.chat,
    idleAfterSuccess: true,
    locale,
    maxRounds: 32,
    systemPrompt,
    tools: ({ isStopped }) => ({
      snappy: _.fromEntries(
        toolList.flatMap(([toolId, tool]) => {
          const agentTool = tool({ config: aiConfig, feed, files, isStopped, locale, media });

          return agentTool === undefined ? [] : [[toolId, agentTool]];
        }),
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
