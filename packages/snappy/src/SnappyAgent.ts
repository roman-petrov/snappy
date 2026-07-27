/* eslint-disable functional/no-expression-statements */
import type { AiChatCompletionsInput } from "@snappy/ai";

import { Agent } from "@snappy/agent";
import { _ } from "@snappy/core";
import { Bilingual, type Locale } from "@snappy/intl";
import { type SkillId, Skills } from "@snappy/snappy-skills";

import type { SnappyToolId } from "./SnappyToolId";
import type { AgentAiConfig, AgentFeedRuntime } from "./Types";

import { Skill } from "./Skill";
import { System } from "./System";
import tools from "./tools/index";

export type SnappyAgentConfig = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  locale: Locale;
  setup?: SnappySetup;
};

export type SnappySetup = { skill?: SkillId; tools: readonly SnappyToolId[] };

export const SnappyAgent = ({ aiConfig, feed, locale, setup }: SnappyAgentConfig) => {
  const skills = Skill.parse(Skills);
  const files: Record<string, File> = {};
  const media: Record<string, string> = {};
  const searchEnabled = setup === undefined || setup.tools.includes(`web-search`);
  const seamless = searchEnabled && aiConfig.models.chat.capabilities.webSearch === true;
  const base = System.prompt(locale, setup === undefined);
  const skill = setup?.skill === undefined ? undefined : skills.find(entry => entry.id === setup.skill)?.content;
  const systemPrompt = skill === undefined ? base : [...base, [`skill_${setup?.skill ?? ``}`, skill] as const];

  const chatModel = seamless
    ? {
        ...aiConfig.models.chat,
        completions: (input: AiChatCompletionsInput) => aiConfig.models.chat.completions({ ...input, webSearch: true }),
      }
    : aiConfig.models.chat;

  const toolList =
    setup === undefined
      ? _.entries(tools)
      : setup.tools.flatMap(toolId => (tools[toolId] === undefined ? [] : [[toolId, tools[toolId]] as const]));

  const agent = Agent({
    chatModel,
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
      reasoningStream: async stream =>
        feed.appendDetailStream({
          completed: Bilingual.pick(locale, [`Thought`, `Мысль`]),
          running: Bilingual.pick(locale, [`Thinking...`, `Думаю...`]),
          stream,
        }),
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
