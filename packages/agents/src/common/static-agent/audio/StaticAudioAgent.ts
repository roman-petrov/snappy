import { Ai } from "@snappy/ai";
import { createElement } from "react";

import type { AgentComponentProps, AgentDefinition, AgentRegenerateInput } from "../../../Types";
import type { StaticAgentMeta, StaticAgentMetaParameters } from "../StaticAgentMeta";

import { StaticAudioAgentComponent } from "./StaticAudioAgentComponent";

export const StaticAudioAgent =
  (data: StaticAgentMeta, parameters?: StaticAgentMetaParameters) =>
  (locale: AgentComponentProps[`locale`]): Omit<AgentDefinition, `id`> => {
    const { plan, prompt, ...meta } = data({ maxSpeechFileMegaBytes: 0, ...parameters }, locale);

    const regenerate = async ({ aiConfig, artifact, locale }: AgentRegenerateInput) => {
      const ai = await Ai({ ...aiConfig.options, locale });

      const session = await ai.chat.completions.create({
        model: aiConfig.models.chat,
        prompt: artifact.generationPrompt,
      });

      let html = ``;
      for await (const part of session.stream) {
        if (part.type === `text`) {
          html += part.text;
        }
      }
      await session.cost();

      return { html };
    };

    return {
      component: props => createElement(StaticAudioAgentComponent, { ...props, agentId: meta.title, plan, prompt }),
      headless: { regenerate },
      meta,
    };
  };
